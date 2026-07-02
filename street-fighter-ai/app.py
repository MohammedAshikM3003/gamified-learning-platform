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
        combo_glow = 0.15 + min(combo, 8) * 0.05
        action = (info.get("last_action") or "").lower()
        is_player_attack = "player" in action
        is_enemy_attack = "enemy" in action
        action_flash = 10 if is_player_attack else -10 if is_enemy_attack else 0
        player_pose = "attack" if is_player_attack else "guard" if is_enemy_attack else "idle"
        enemy_pose = "hit" if is_player_attack else "attack" if is_enemy_attack else "idle"
        message = html.escape(info["message"])
        last_action = html.escape(info["last_action"])
        star_count = max(1, min(3, 1 + combo // 3))
        stars = "★" * star_count + "☆" * (3 - star_count)

        sparks = []
        for index in range(6):
                angle = t * 4 + index * 1.05
                x = 480 + math.cos(angle) * (120 + combo * 6)
                y = 250 + math.sin(angle * 1.2) * (55 + combo * 2)
                size = 4 + (index % 3)
                sparks.append((x, y, size))

        player_attack_fx = (
                """
            <path d='M124 92 L184 70 L176 92 L210 96 L156 124 L164 102 Z' fill='#f8fafc' opacity='0.95'/>
            <path d='M34 102 L-6 116 L24 132 L8 154 L52 140 L42 118 Z' fill='#bfdbfe' opacity='0.75'/>
                """
                if player_pose == "attack"
                else ""
        )

        player_combo_fx = (
                """
            <circle cx='148' cy='92' r='24' fill='none' stroke='#a78bfa' stroke-width='3' opacity='0.75' filter='url(#glow)'/>
                """
                if combo >= 3
                else ""
        )

        enemy_attack_fx = (
                """
            <path d='M124 90 L188 82 L178 102 L206 120 L152 146 L160 118 Z' fill='#fff1f2' opacity='0.95'/>
            <path d='M140 88 L188 58 L184 86 L224 84 L186 120 L190 98 Z' fill='#fda4af' opacity='0.95'/>
                """
                if enemy_pose == "attack"
                else ""
        )

        enemy_hit_fx = (
                """
            <path d='M-4 106 L42 126 L34 98 L66 86 L18 58 L22 88 Z' fill='#fee2e2' opacity='0.85'/>
                """
                if enemy_pose == "hit" or is_enemy_attack
                else ""
        )

        spark_svg = "".join(
                f"<circle cx='{int(x)}' cy='{int(y)}' r='{size}' fill='#fde68a' opacity='0.9' filter='url(#glow)'/>"
                for x, y, size in sparks
        )
        star_svg = "".join(
                f"<circle cx='{int(220 + i * 112 + math.sin(t * 5 + i) * 8)}' cy='{int(210 + math.cos(t * 3 + i) * 6)}' r='2' fill='#fff' opacity='{0.4 + (i % 3) * 0.2}'/>"
                for i in range(18)
        )

        return f"""<svg xmlns='http://www.w3.org/2000/svg' width='{width}' height='{height}' viewBox='0 0 {width} {height}'>
    <defs>
        <style>
            .pixel {{ shape-rendering: crispEdges; }}
            .hud {{ font-family: 'Courier New', monospace; letter-spacing: 1px; }}
        </style>
        <linearGradient id='sky' x1='0' y1='0' x2='0' y2='1'>
            <stop offset='0%' stop-color='#180f31'/>
            <stop offset='40%' stop-color='#0b1020'/>
            <stop offset='100%' stop-color='#06070c'/>
        </linearGradient>
        <linearGradient id='stage' x1='0' y1='0' x2='1' y2='1'>
            <stop offset='0%' stop-color='#3b236f'/>
            <stop offset='52%' stop-color='#171a31'/>
            <stop offset='100%' stop-color='#0a0b16'/>
        </linearGradient>
        <linearGradient id='enemy' x1='0' y1='0' x2='1' y2='1'>
            <stop offset='0%' stop-color='#ff6b6b'/>
            <stop offset='100%' stop-color='#d11f4f'/>
        </linearGradient>
        <linearGradient id='player' x1='0' y1='0' x2='1' y2='1'>
            <stop offset='0%' stop-color='#62d2ff'/>
            <stop offset='100%' stop-color='#1d4ed8'/>
        </linearGradient>
        <linearGradient id='floor' x1='0' y1='0' x2='0' y2='1'>
            <stop offset='0%' stop-color='#1f1736'/>
            <stop offset='100%' stop-color='#07080f'/>
        </linearGradient>
        <linearGradient id='beam' x1='0' y1='0' x2='1' y2='0'>
            <stop offset='0%' stop-color='#fff' stop-opacity='0.05'/>
            <stop offset='50%' stop-color='#fff' stop-opacity='0.22'/>
            <stop offset='100%' stop-color='#fff' stop-opacity='0.05'/>
        </linearGradient>
        <linearGradient id='textGlow' x1='0' y1='0' x2='1' y2='0'>
            <stop offset='0%' stop-color='#fde68a'/>
            <stop offset='50%' stop-color='#f8fafc'/>
            <stop offset='100%' stop-color='#93c5fd'/>
        </linearGradient>
        <filter id='glow'>
            <feGaussianBlur stdDeviation='{pulse}' result='blur'/>
            <feMerge>
                <feMergeNode in='blur'/>
                <feMergeNode in='SourceGraphic'/>
            </feMerge>
        </filter>
        <filter id='softGlow'>
            <feGaussianBlur stdDeviation='5' result='blur'/>
            <feMerge>
                <feMergeNode in='blur'/>
                <feMergeNode in='SourceGraphic'/>
            </feMerge>
        </filter>
    </defs>

    <rect width='100%' height='100%' fill='url(#sky)'/>
    <circle cx='128' cy='94' r='{72 + pulse * 2}' fill='#8b5cf6' opacity='{glow}' filter='url(#glow)'/>
    <circle cx='820' cy='132' r='{64 + pulse * 1.5}' fill='#fb7185' opacity='{glow}' filter='url(#glow)'/>
    <circle cx='490' cy='72' r='18' fill='#fde68a' opacity='0.9'/>
    <rect x='0' y='226' width='960' height='2' fill='#ffffff' opacity='0.07'/>

    <g opacity='0.7'>
        <rect x='48' y='170' width='62' height='92' rx='8' fill='#2a1b4f'/>
        <rect x='138' y='148' width='76' height='114' rx='8' fill='#301d56'/>
        <rect x='742' y='154' width='86' height='108' rx='8' fill='#301d56'/>
        <rect x='846' y='174' width='52' height='88' rx='8' fill='#2a1b4f'/>
    </g>

    <rect x='0' y='302' width='960' height='238' fill='url(#stage)'/>
    <path d='M0 356 L120 342 L240 364 L360 346 L480 362 L600 348 L720 367 L840 344 L960 358 L960 540 L0 540 Z' fill='url(#floor)'/>
    <path d='M0 378 L960 378' stroke='url(#beam)' stroke-width='6' opacity='0.75'/>
    <path d='M0 412 L960 412' stroke='rgba(255,255,255,0.05)' stroke-width='2'/>
    <path d='M0 447 L960 447' stroke='rgba(255,255,255,0.035)' stroke-width='2'/>
    <path d='M0 486 L960 486' stroke='rgba(255,255,255,0.025)' stroke-width='2'/>
    <path d='M-40 540 L180 388 L300 540' fill='none' stroke='rgba(255,255,255,0.05)' stroke-width='2'/>
    <path d='M210 540 L360 388 L510 540' fill='none' stroke='rgba(255,255,255,0.05)' stroke-width='2'/>
    <path d='M430 540 L540 388 L690 540' fill='none' stroke='rgba(255,255,255,0.05)' stroke-width='2'/>
    <path d='M670 540 L810 388 L1000 540' fill='none' stroke='rgba(255,255,255,0.05)' stroke-width='2'/>

    <ellipse cx='280' cy='392' rx='170' ry='28' fill='rgba(0,0,0,0.26)'/>
    <ellipse cx='690' cy='392' rx='170' ry='28' fill='rgba(0,0,0,0.26)'/>

    <g transform='translate(70 24)'>
        <rect x='0' y='0' width='250' height='88' rx='16' fill='rgba(0,0,0,0.28)' stroke='rgba(255,255,255,0.08)'/>
        <text x='16' y='28' fill='url(#textGlow)' class='hud' font-size='22' font-weight='800'>LEARNCRAFT</text>
        <text x='16' y='52' fill='#e5e7eb' class='hud' font-size='14'>ARCADE MODE // ROUND {info['round']}</text>
        <text x='16' y='74' fill='#cbd5e1' class='hud' font-size='12'>ACTION: {last_action}</text>
    </g>

    <g transform='translate(636 24)'>
        <rect x='0' y='0' width='250' height='88' rx='16' fill='rgba(0,0,0,0.28)' stroke='rgba(255,255,255,0.08)'/>
        <text x='18' y='28' fill='#fca5a5' class='hud' font-size='14' font-weight='800'>STATUS</text>
        <text x='18' y='53' fill='#f8fafc' class='hud' font-size='12'>{message}</text>
        <text x='18' y='74' fill='#fde68a' class='hud' font-size='12'>COMBO x{combo} • {stars}</text>
    </g>

    <rect x='170' y='106' width='620' height='18' rx='9' fill='rgba(17,24,39,0.9)' stroke='rgba(255,255,255,0.08)'/>
    <rect x='188' y='110' width='{player_bar}' height='10' rx='5' fill='url(#player)'/>
    <rect x='432' y='110' width='{enemy_bar}' height='10' rx='5' fill='url(#enemy)'/>
    <text x='170' y='100' fill='#dbeafe' class='hud' font-size='18' font-weight='700'>PLAYER</text>
    <text x='758' y='100' fill='#fee2e2' class='hud' font-size='18' font-weight='700'>ENEMY</text>
    <text x='430' y='100' fill='#cbd5e1' class='hud' font-size='14' font-weight='600'>HP {player_hp}% / {enemy_hp}%</text>

    <g transform='translate(134 {250 + player_shift})'>
        <g filter='url(#softGlow)' opacity='{0.55 + combo_glow}'>
            <ellipse cx='92' cy='164' rx='62' ry='20' fill='#60a5fa' opacity='0.32'/>
        </g>
        <g transform='translate({action_flash} 0)'>
            <ellipse cx='86' cy='54' rx='18' ry='22' fill='#e0f2fe'/>
            <rect x='60' y='76' width='54' height='76' rx='12' fill='url(#player)'/>
            <rect x='44' y='88' width='18' height='52' rx='8' fill='#7dd3fc'/>
            <rect x='112' y='88' width='18' height='52' rx='8' fill='#7dd3fc'/>
            <rect x='60' y='150' width='16' height='74' rx='8' fill='#cbd5e1'/>
            <rect x='86' y='150' width='16' height='74' rx='8' fill='#cbd5e1'/>
            <rect x='51' y='66' width='70' height='14' rx='7' fill='rgba(255,255,255,0.8)' opacity='0.5'/>
            {player_attack_fx}
            {player_combo_fx}
        </g>
    </g>

    <g transform='translate(654 {236 + enemy_shift})'>
        <g filter='url(#softGlow)' opacity='{0.55 + combo_glow}'>
            <ellipse cx='86' cy='188' rx='66' ry='22' fill='#fb7185' opacity='0.32'/>
        </g>
        <g transform='translate({-action_flash} 0)'>
            <ellipse cx='84' cy='54' rx='20' ry='24' fill='#ffe4e6'/>
            <rect x='58' y='78' width='56' height='82' rx='14' fill='url(#enemy)'/>
            <rect x='38' y='92' width='18' height='56' rx='8' fill='#fda4af'/>
            <rect x='114' y='92' width='18' height='56' rx='8' fill='#fda4af'/>
            <rect x='62' y='160' width='16' height='78' rx='8' fill='#e5e7eb'/>
            <rect x='88' y='160' width='16' height='78' rx='8' fill='#e5e7eb'/>
            <rect x='50' y='66' width='72' height='14' rx='7' fill='rgba(255,255,255,0.85)' opacity='0.45'/>
            {enemy_attack_fx}
            {enemy_hit_fx}
        </g>
    </g>

    {spark_svg}
    {star_svg}

    <rect x='24' y='444' width='912' height='70' rx='20' fill='rgba(0,0,0,0.34)' stroke='rgba(255,255,255,0.08)'/>
    <text x='46' y='475' fill='#f8fafc' class='hud' font-size='15' font-weight='700'>RETRO BATTLE READY</text>
    <text x='46' y='500' fill='#cbd5e1' class='hud' font-size='12'>Press START to enter the arena, then answer to attack and build combo power.</text>
    <text x='684' y='475' fill='#fde68a' class='hud' font-size='15' font-weight='700'>SCORE FX</text>
    <text x='684' y='500' fill='#cbd5e1' class='hud' font-size='12'>Stars {stars} • Combo x{combo} • Round {info['round']}</text>
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
