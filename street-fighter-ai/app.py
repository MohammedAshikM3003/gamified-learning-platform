from __future__ import annotations

import base64
import html
import json
import math
import random
import threading
import time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlparse

HOST = "127.0.0.1"
PORT = 8766

STATE_LOCK = threading.Lock()
STATE = {
    "started": False,
    "start_time": time.time(),
    "last_action": "Idle",
    "message": "Press start to enter the arena.",
    "player_hp": 100,
    "enemy_hp": 100,
    "player_combo": 0,
    "round": 1,
}


def reset_state() -> None:
    STATE.update(
        {
            "started": True,
            "start_time": time.time(),
            "last_action": "Start",
            "message": "Battle online. Answer a question to attack.",
            "player_hp": 100,
            "enemy_hp": 100,
            "player_combo": 0,
            "round": 1,
        }
    )


def clamp(value: int, low: int = 0, high: int = 100) -> int:
    return max(low, min(high, value))


def apply_action(cmd: str) -> dict:
    cmd = (cmd or "").strip().lower()
    if not STATE["started"]:
        reset_state()

    if cmd == "player_attack":
        damage = random.randint(10, 18) + STATE["player_combo"] * 2
        STATE["enemy_hp"] = clamp(STATE["enemy_hp"] - damage)
        STATE["player_combo"] += 1
        STATE["last_action"] = "Player attack"
        STATE["message"] = f"Player attacked for {damage} damage."
        if STATE["enemy_hp"] <= 0:
            STATE["message"] = "Enemy defeated. Prepare the next round."
            STATE["round"] += 1
            STATE["enemy_hp"] = 100
            STATE["player_combo"] = 0
    elif cmd == "enemy_attack":
        damage = random.randint(8, 16)
        STATE["player_hp"] = clamp(STATE["player_hp"] - damage)
        STATE["player_combo"] = 0
        STATE["last_action"] = "Enemy attack"
        STATE["message"] = f"Enemy attacked for {damage} damage."
        if STATE["player_hp"] <= 0:
            STATE["message"] = "Player knocked out. Resetting arena."
            STATE["round"] = 1
            STATE["player_hp"] = 100
            STATE["enemy_hp"] = 100
            STATE["player_combo"] = 0
    else:
        STATE["last_action"] = cmd or "Idle"
        STATE["message"] = "Waiting for the next move."

    return build_info()


def build_info() -> dict:
    elapsed = int(time.time() - STATE["start_time"])
    return {
        "started": STATE["started"],
        "elapsed": elapsed,
        "message": STATE["message"],
        "last_action": STATE["last_action"],
        "player_hp": STATE["player_hp"],
        "enemy_hp": STATE["enemy_hp"],
        "player_combo": STATE["player_combo"],
        "round": STATE["round"],
        "status": "online",
    }


def render_frame_svg(info: dict) -> str:
    width = 960
    height = 540
    t = time.time() - STATE["start_time"]
    pulse = 8 + math.sin(t * 3.2) * 4
    glow = 0.2 + (math.sin(t * 2.1) + 1) * 0.12
    enemy_shift = math.sin(t * 1.4) * 10
    player_shift = math.cos(t * 1.6) * 8
    enemy_hp = info["enemy_hp"]
    player_hp = info["player_hp"]
    enemy_bar = max(0, int(340 * enemy_hp / 100))
    player_bar = max(0, int(340 * player_hp / 100))
    combo = info["player_combo"]
    message = html.escape(info["message"])
    last_action = html.escape(info["last_action"])

    return f"""<svg xmlns='http://www.w3.org/2000/svg' width='{width}' height='{height}' viewBox='0 0 {width} {height}'>
  <defs>
    <linearGradient id='sky' x1='0' y1='0' x2='0' y2='1'>
      <stop offset='0%' stop-color='#180f31'/>
      <stop offset='55%' stop-color='#0b1020'/>
      <stop offset='100%' stop-color='#06070c'/>
    </linearGradient>
    <linearGradient id='stage' x1='0' y1='0' x2='1' y2='1'>
      <stop offset='0%' stop-color='#2b1c52'/>
      <stop offset='100%' stop-color='#10121f'/>
    </linearGradient>
    <linearGradient id='enemy' x1='0' y1='0' x2='1' y2='1'>
      <stop offset='0%' stop-color='#ff6b6b'/>
      <stop offset='100%' stop-color='#d11f4f'/>
    </linearGradient>
    <linearGradient id='player' x1='0' y1='0' x2='1' y2='1'>
      <stop offset='0%' stop-color='#62d2ff'/>
      <stop offset='100%' stop-color='#1d4ed8'/>
    </linearGradient>
    <filter id='glow'>
      <feGaussianBlur stdDeviation='{pulse}' result='blur'/>
      <feMerge>
        <feMergeNode in='blur'/>
        <feMergeNode in='SourceGraphic'/>
      </feMerge>
    </filter>
  </defs>

  <rect width='100%' height='100%' fill='url(#sky)'/>
  <circle cx='150' cy='100' r='{70 + pulse * 2}' fill='#8b5cf6' opacity='{glow}' filter='url(#glow)'/>
  <circle cx='810' cy='130' r='{60 + pulse * 1.5}' fill='#fb7185' opacity='{glow}' filter='url(#glow)'/>
  <rect x='0' y='350' width='960' height='190' fill='url(#stage)'/>
  <ellipse cx='480' cy='365' rx='320' ry='42' fill='#000' opacity='0.25'/>
  <rect x='170' y='385' width='620' height='18' rx='9' fill='#111827'/>
  <rect x='188' y='389' width='{player_bar}' height='10' rx='5' fill='url(#player)'/>
  <rect x='432' y='389' width='{enemy_bar}' height='10' rx='5' fill='url(#enemy)'/>
  <text x='40' y='378' fill='#dbeafe' font-family='Verdana, sans-serif' font-size='18' font-weight='700'>PLAYER</text>
  <text x='760' y='378' fill='#fee2e2' font-family='Verdana, sans-serif' font-size='18' font-weight='700'>ENEMY</text>
  <text x='430' y='378' fill='#cbd5e1' font-family='Verdana, sans-serif' font-size='14' font-weight='600'>ROUND {info['round']}</text>

  <g transform='translate(170 {300 + player_shift})'>
    <circle cx='70' cy='58' r='28' fill='#f8fafc'/>
    <rect x='50' y='84' width='40' height='82' rx='14' fill='url(#player)'/>
    <rect x='31' y='94' width='20' height='56' rx='8' fill='#93c5fd'/>
    <rect x='89' y='94' width='20' height='56' rx='8' fill='#93c5fd'/>
    <rect x='50' y='162' width='16' height='66' rx='8' fill='#cbd5e1'/>
    <rect x='74' y='162' width='16' height='66' rx='8' fill='#cbd5e1'/>
    <circle cx='70' cy='56' r='34' fill='none' stroke='#62d2ff' stroke-width='3' opacity='0.7'/>
  </g>

  <g transform='translate(630 {292 + enemy_shift})'>
    <circle cx='70' cy='58' r='30' fill='#fff1f2'/>
    <rect x='48' y='86' width='44' height='88' rx='16' fill='url(#enemy)'/>
    <rect x='28' y='96' width='20' height='58' rx='8' fill='#fda4af'/>
    <rect x='92' y='96' width='20' height='58' rx='8' fill='#fda4af'/>
    <rect x='52' y='172' width='16' height='68' rx='8' fill='#e5e7eb'/>
    <rect x='76' y='172' width='16' height='68' rx='8' fill='#e5e7eb'/>
    <circle cx='70' cy='58' r='38' fill='none' stroke='#fb7185' stroke-width='3' opacity='0.8'/>
  </g>

  <rect x='26' y='24' width='908' height='96' rx='18' fill='rgba(0,0,0,0.28)' stroke='rgba(255,255,255,0.08)'/>
  <text x='50' y='56' fill='#f8fafc' font-family='Verdana, sans-serif' font-size='26' font-weight='800'>LEARNCRAFT STREET FIGHTER</text>
  <text x='50' y='84' fill='#d1d5db' font-family='Verdana, sans-serif' font-size='16'>Action: {last_action}</text>
  <text x='50' y='108' fill='#cbd5e1' font-family='Verdana, sans-serif' font-size='14'>Combo {combo} • HP {player_hp}% vs {enemy_hp}%</text>

  <rect x='640' y='42' width='250' height='60' rx='14' fill='rgba(10,10,16,0.55)' stroke='rgba(255,255,255,0.08)'/>
  <text x='660' y='67' fill='#a78bfa' font-family='Verdana, sans-serif' font-size='14' font-weight='700'>STATUS</text>
  <text x='660' y='89' fill='#f8fafc' font-family='Verdana, sans-serif' font-size='12'>{message}</text>

  <rect x='230' y='450' width='500' height='48' rx='24' fill='rgba(139,92,246,0.12)' stroke='rgba(139,92,246,0.24)'/>
  <text x='250' y='479' fill='#ede9fe' font-family='Verdana, sans-serif' font-size='15' font-weight='700'>Answer questions to attack. Wrong answers trigger enemy strikes.</text>
</svg>"""


class GameHandler(BaseHTTPRequestHandler):
    def log_message(self, format: str, *args) -> None:  # noqa: A003
        return

    def _send_json(self, payload: dict, status: int = 200) -> None:
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(body)

    def _send_text(self, body: bytes, content_type: str, status: int = 200) -> None:
        self.send_response(status)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self) -> None:
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_GET(self) -> None:
        path = urlparse(self.path).path
        if path in {"/", "/status"}:
            with STATE_LOCK:
                self._send_json(build_info())
            return

        if path in {"/frame-data", "/frame.jpg"}:
            with STATE_LOCK:
                info = build_info()
                svg = render_frame_svg(info)
                image = base64.b64encode(svg.encode("utf-8")).decode("ascii")
                self._send_json({"mime": "image/svg+xml", "image": image, "info": info})
            return

        self._send_json({"error": "not found"}, 404)

    def do_POST(self) -> None:
        path = urlparse(self.path).path
        length = int(self.headers.get("Content-Length", "0") or "0")
        raw = self.rfile.read(length) if length else b"{}"
        try:
            payload = json.loads(raw.decode("utf-8") or "{}")
        except json.JSONDecodeError:
            payload = {}

        if path == "/start":
            with STATE_LOCK:
                reset_state()
                self._send_json(build_info())
            return

        if path == "/action":
            with STATE_LOCK:
                info = apply_action(payload.get("cmd", ""))
                self._send_json({"ok": True, "info": info})
            return

        self._send_json({"error": "not found"}, 404)


def main() -> None:
    server = ThreadingHTTPServer((HOST, PORT), GameHandler)
    print(f"Street Fighter game server running on http://{HOST}:{PORT}")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
