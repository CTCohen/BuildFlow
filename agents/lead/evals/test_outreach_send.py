"""Evals for the Outreach/Copy templates, sequence scheduler and send workflow (all mock)."""
import copy
import os
import re
import unittest
from datetime import date, datetime, timedelta, timezone
from pathlib import Path
from unittest import mock

from agents.lead.send import (
    MAILING_ADDRESS_ENV_VAR,
    Campaign,
    ConfigError,
    MockSendGrid,
    load_mailing_address,
    unsubscribe_token,
)
from agents.lead.sequence import choose_hook, load_templates, render_touch, schedule

UTC = timezone.utc
KW = dict(sender_name="Tyler", unsubscribe_url="https://u.example/x", postal_address="1 Test St, Phoenix AZ")


def lead(i=1, state="AZ", **k):
    return {"lead_id": f"L{i}", "email": f"lead{i}@x.example", "company": f"Acme {i} Plumbing", "state": state,
            "city": "Mesa", "vertical": "plumbing", "contact_name": "Sam Lee", **k}


def camp(**k):
    return Campaign(MockSendGrid(), secret="test-secret", postal_address="1 Test St", **k)


def nine_am_az(d):  # AZ has no DST: 9 AM = 16:00 UTC
    return datetime(d.year, d.month, d.day, 16, 0, tzinfo=UTC)


D0 = date(2026, 10, 5)


class OutreachTemplates(unittest.TestCase):
    def test_o01_schedule_offsets(self):
        days = [s["local_date"] for s in schedule(D0, "AZ")]
        self.assertEqual(days, [D0 + timedelta(days=n) for n in (0, 3, 7, 14, 21)])

    def test_o02_az_no_dst(self):
        for s in schedule(date(2026, 10, 12), "AZ"):
            self.assertEqual(s["send_at_utc"].hour, 16)

    def test_o03_ny_dst_shift(self):
        s = schedule(date(2026, 10, 12), "NY")   # DST ends Nov 1; day 21 = Nov 2
        self.assertEqual([x["send_at_utc"].hour for x in s], [13, 13, 13, 13, 14])

    def test_o04_texas_central(self):
        self.assertEqual(schedule(D0, "TX")[0]["send_at_utc"].hour, 14)

    def test_o05_unknown_state_defaults(self):
        self.assertEqual(schedule(D0, None)[0]["send_at_utc"].hour, 13)

    def test_o06_hook_no_website(self):
        self.assertEqual(choose_hook({"has_website": False, "review_count": 200}), "no_website")

    def test_o07_hook_weak_site(self):
        self.assertEqual(choose_hook({"has_website": True, "pagespeed_score": 30}), "weak_website")

    def test_o08_hook_reviews_in_copy(self):
        m = render_touch(1, lead(review_count=120, has_website=True, has_gbp=True), "https://d/x", **KW)
        self.assertEqual(m["hook"], "reviews_strong")
        self.assertIn("120 Google reviews", m["body"])

    def test_o09_hook_no_gbp(self):
        self.assertEqual(choose_hook({"has_website": True, "has_gbp": False}), "no_gbp")

    def test_o10_hook_default(self):
        self.assertEqual(choose_hook({"has_website": True, "has_gbp": True, "review_count": 3}), "default")

    def test_o11_footer_on_all_touches(self):
        for n in range(1, 6):
            b = render_touch(n, lead(), "https://d/x", **KW)["body"]
            self.assertIn("https://u.example/x", b)
            self.assertIn("1 Test St", b)
            self.assertIn("https://d/x", b)

    def test_o12_missing_first_name(self):
        l = lead(); del l["contact_name"]
        self.assertTrue(render_touch(1, l, "https://d/x", **KW)["body"].startswith("Hi there,"))

    def test_o13_unresolved_field_raises(self):
        t = copy.deepcopy(load_templates())
        t["touches"]["1"]["body"] += " {{nonexistent}}"
        with self.assertRaises(KeyError):
            render_touch(1, lead(), "https://d/x", templates=t, **KW)

    def test_o14_bad_touch(self):
        with self.assertRaises(ValueError):
            render_touch(6, lead(), "https://d/x", **KW)

    def test_o15_no_outcome_promises_or_fake_proof(self):
        t = load_templates()
        text = " ".join(x["subject"] + x["body"] for x in t["touches"].values()).lower()
        for banned in ("guarantee", "testimonial", "% more", "more leads", "customers say", "results"):
            self.assertNotIn(banned, text)

    def test_o16_copy_is_draft(self):
        self.assertEqual(load_templates()["meta"]["status"], "draft")


class SendWorkflow(unittest.TestCase):
    def test_c01_nothing_before_9am_local(self):
        c = camp(); c.enroll(lead(), "u", D0)
        self.assertEqual(c.run(nine_am_az(D0) - timedelta(minutes=1))["sent"], [])
        self.assertEqual(c.run(nine_am_az(D0))["sent"], [("L1", 1)])

    def test_c02_one_per_lead_per_day(self):
        c = camp(); c.enroll(lead(), "u", D0)
        c.run(nine_am_az(D0)); c.run(nine_am_az(D0) + timedelta(hours=3))
        self.assertEqual(len(c.sender.sent), 1)

    def test_c03_full_sequence_dates(self):
        c = camp(); c.enroll(lead(), "u", D0)
        sent_days = []
        for i in range(25):
            d = D0 + timedelta(days=i)
            if c.run(nine_am_az(d))["sent"]:
                sent_days.append(i)
        self.assertEqual(sent_days, [0, 3, 7, 14, 21])
        self.assertEqual(c.enrollments["L1"].status, "completed")

    def test_c04_touch2_skipped_if_opened(self):
        c = camp(); c.enroll(lead(), "u", D0)
        c.run(nine_am_az(D0)); c.handle_event("open", "L1")
        r = c.run(nine_am_az(D0 + timedelta(days=3)))
        self.assertEqual(r["sent"], []); self.assertEqual(r["skipped"], [("L1", 2, "opened")])
        self.assertEqual(c.run(nine_am_az(D0 + timedelta(days=7)))["sent"], [("L1", 3)])

    def test_c05_touch2_sent_if_unopened(self):
        c = camp(); c.enroll(lead(), "u", D0)
        c.run(nine_am_az(D0))
        self.assertEqual(c.run(nine_am_az(D0 + timedelta(days=3)))["sent"], [("L1", 2)])

    def test_c06_unsub_headers_on_every_message(self):
        c = camp(); c.enroll(lead(), "u", D0)
        for d in (0, 3, 7, 14, 21):
            c.run(nine_am_az(D0 + timedelta(days=d)))
        self.assertEqual(len(c.sender.sent), 5)
        for m in c.sender.sent:
            self.assertRegex(m["headers"]["List-Unsubscribe"], r"^<https://.+/u/L1/[0-9a-f]{32}>$")
            self.assertEqual(m["headers"]["List-Unsubscribe-Post"], "List-Unsubscribe=One-Click")
            self.assertIn("Unsubscribe:", m["body"])

    def test_c08_sender_is_hello_by_default(self):
        # D01 (ruled 2026-09-21): sender address is hello@, not a personal address.
        c = camp(); c.enroll(lead(), "u", D0)
        c.run(nine_am_az(D0))
        self.assertEqual(c.sender.sent[0]["from"], "hello@fornax.example")

    def test_c09_sender_email_configurable(self):
        c = camp(sender_email="hello@fornax.example"); c.enroll(lead(), "u", D0)
        c.run(nine_am_az(D0))
        self.assertEqual(c.sender.sent[0]["from"], "hello@fornax.example")

    def test_c07_unsubscribe_stops_sequence(self):
        c = camp(); c.enroll(lead(), "u", D0); c.run(nine_am_az(D0))
        self.assertTrue(c.unsubscribe("L1", unsubscribe_token("test-secret", "L1")))
        self.assertEqual(c.run(nine_am_az(D0 + timedelta(days=3)))["sent"], [])
        self.assertEqual(c.enrollments["L1"].status, "unsubscribed")

    def test_c08_bad_token_rejected(self):
        c = camp(); c.enroll(lead(), "u", D0)
        self.assertFalse(c.unsubscribe("L1", "0" * 32))
        self.assertEqual(c.enrollments["L1"].status, "active")

    def test_c09_unsubscribe_idempotent(self):
        c = camp(); c.enroll(lead(), "u", D0); t = unsubscribe_token("test-secret", "L1")
        self.assertTrue(c.unsubscribe("L1", t)); self.assertTrue(c.unsubscribe("L1", t))
        self.assertEqual(list(c.suppressed), ["lead1@x.example"])

    def test_c10_unsubscribe_works_while_paused(self):
        c = camp(); c.enroll(lead(), "u", D0); c.paused = True
        self.assertTrue(c.unsubscribe("L1", unsubscribe_token("test-secret", "L1")))
        self.assertIn("lead1@x.example", c.suppressed)

    def test_c11_token_deterministic(self):
        self.assertEqual(unsubscribe_token("s", "L1"), unsubscribe_token("s", "L1"))
        self.assertNotEqual(unsubscribe_token("s", "L1"), unsubscribe_token("s", "L2"))
        self.assertNotEqual(unsubscribe_token("s", "L1"), unsubscribe_token("t", "L1"))

    def test_c12_hard_bounce_suppresses(self):
        c = camp(); c.enroll(lead(), "u", D0); c.run(nine_am_az(D0)); c.handle_event("bounce_hard", "L1")
        self.assertEqual(c.run(nine_am_az(D0 + timedelta(days=3)))["sent"], [])
        self.assertEqual(c.suppressed["lead1@x.example"], "hard bounce")

    def test_c13_complaint_suppresses(self):
        c = camp(); c.enroll(lead(), "u", D0); c.run(nine_am_az(D0)); c.handle_event("spam_complaint", "L1")
        self.assertEqual(c.enrollments["L1"].status, "complained")

    def _big(self, n, **k):
        c = camp(**k)
        for i in range(n):
            c.enroll(lead(i), "u", D0)
        c.run(nine_am_az(D0))
        return c

    def test_c14_pause_at_5pct_complaints(self):
        c = self._big(40)
        c.handle_event("spam_complaint", "L0"); self.assertFalse(c.paused)
        c.handle_event("spam_complaint", "L1")   # 2/40 = 5%
        self.assertTrue(c.paused)
        self.assertEqual(c.run(nine_am_az(D0 + timedelta(days=3)))["sent"], [])

    def test_c15_no_pause_under_min_sample(self):
        c = self._big(10)
        c.handle_event("spam_complaint", "L0")
        self.assertFalse(c.paused)

    def test_c16_pause_on_bounce_rate(self):
        c = self._big(40)
        c.handle_event("bounce_hard", "L0"); c.handle_event("bounce_hard", "L1")
        self.assertTrue(c.paused); self.assertEqual(c.pause_reason, "bounce rate >= 5%")

    def test_c17_complaint_alert_below_pause(self):
        c = self._big(40)
        c.handle_event("spam_complaint", "L0")   # 2.5%: alert, no pause
        self.assertIn("complaint_rate_high", c.alerts); self.assertFalse(c.paused)

    def test_c18_suppressed_cannot_reenroll(self):
        c = camp(); c.enroll(lead(), "u", D0); c.unsubscribe("L1", unsubscribe_token("test-secret", "L1"))
        self.assertFalse(c.enroll({**lead(), "lead_id": "L99"}, "u", D0))

    def test_c19_midmarket_suppressed_not_enrolled(self):
        self.assertFalse(camp().enroll(lead(suppressed=True), "u", D0))

    def test_c20_postal_address_required(self):
        c = Campaign(MockSendGrid(), secret="s", postal_address="")
        c.enroll(lead(), "u", D0)
        with self.assertRaises(ConfigError):
            c.run(nine_am_az(D0))

    def test_c21_real_sender_blocked_on_draft_copy(self):
        class Real:  # anything that is not marked mock
            def send(self, m): raise AssertionError("must never send")
        c = Campaign(Real(), secret="s", postal_address="1 Test St")
        c.enroll(lead(), "u", D0)
        with self.assertRaises(ConfigError):
            c.run(nine_am_az(D0))

    def test_c23_mailing_address_env_var_populates_footer(self):
        """When BUILDFLOW_MAILING_ADDRESS is set and postal_address= is left
        unset, the Campaign reads it and the send actually goes out with it
        in the footer/body (render_touch embeds postal_address)."""
        addr = "742 Evergreen Terrace, Springfield"
        with mock.patch.dict(os.environ, {MAILING_ADDRESS_ENV_VAR: addr}):
            self.assertEqual(load_mailing_address(), addr)
            c = Campaign(MockSendGrid(), secret="test-secret")  # no postal_address kwarg
            self.assertEqual(c.postal, addr)
            c.enroll(lead(), "https://demo.example/u", D0)
            c.run(nine_am_az(D0))
        self.assertEqual(len(c.sender.sent), 1)
        msg = c.sender.sent[0]
        body = msg.get("html", "") + msg.get("text", "") + str(msg)
        self.assertIn(addr, body)

    def test_c24_send_still_refuses_when_env_var_unset(self):
        """No explicit postal_address and no env var/.local file configured
        -> Campaign.postal is falsy and run() still refuses (ConfigError),
        exactly like the pre-existing explicit-empty-string case."""
        env_without_addr = {k: v for k, v in os.environ.items() if k != MAILING_ADDRESS_ENV_VAR}
        with mock.patch.dict(os.environ, env_without_addr, clear=True), \
             mock.patch("agents.lead.config._LOCAL_ENV_DIR", Path("/nonexistent-dir-for-test")):
            self.assertIsNone(load_mailing_address())
            c = Campaign(MockSendGrid(), secret="test-secret")  # no postal_address kwarg
            self.assertFalse(c.postal)
            c.enroll(lead(), "u", D0)
            with self.assertRaises(ConfigError):
                c.run(nine_am_az(D0))

    def test_c22_new_lead_cap_per_day(self):
        c = self._big(10, max_new_per_day=4)
        self.assertEqual(len(c.sender.sent), 4)
        c.run(nine_am_az(D0 + timedelta(days=1)))   # the rest start next day
        self.assertEqual(len(c.sender.sent), 8)
