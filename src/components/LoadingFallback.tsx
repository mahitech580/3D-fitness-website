export function LoadingFallback() {
  return (
    <div className="dragon-fallback" role="img" aria-label="Porcelain dragon illustration fallback">
      <svg viewBox="0 0 380 620" className="fallback-dragon" aria-hidden="true">
        <defs><linearGradient id="ceramic" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fff" /><stop offset="1" stopColor="#dce4eb" /></linearGradient></defs>
        <path d="M210 42 C155 64 152 104 212 129 C282 158 292 201 227 228 C163 254 111 236 91 282 C65 337 120 376 191 366 C267 354 286 394 247 432 C218 460 153 456 140 502 C132 533 162 560 204 570" fill="none" stroke="url(#ceramic)" strokeWidth="50" strokeLinecap="round" />
        <path d="M210 42 C155 64 152 104 212 129 C282 158 292 201 227 228 C163 254 111 236 91 282 C65 337 120 376 191 366 C267 354 286 394 247 432 C218 460 153 456 140 502 C132 533 162 560 204 570" fill="none" stroke="#3d66a7" strokeOpacity=".55" strokeWidth="2" strokeDasharray="2 13" />
        <path d="M198 45 L176 10 Q201 17 215 39 M225 52 L252 21 Q255 43 240 63 M228 77 L281 84 L248 97 M194 79 L148 68 L179 100" fill="url(#ceramic)" stroke="#d5dbe0" strokeWidth="2" strokeLinejoin="round" />
        <path d="M226 67 Q252 53 278 72 L304 92 L280 105 L244 99 Z" fill="url(#ceramic)" stroke="#d5dbe0" strokeWidth="2" />
        <circle cx="254" cy="76" r="6" fill="#315ca5" /><circle cx="256" cy="76" r="2" fill="#101a2c" />
        <path d="M292 92 Q326 87 343 109 Q317 103 303 117 M285 102 Q317 125 330 151" fill="none" stroke="#d8e0e7" strokeWidth="4" strokeLinecap="round" />
        <path d="M94 279 Q67 260 46 237 M104 295 Q72 298 51 318 M244 428 Q278 446 299 465 M231 439 Q248 476 273 491" fill="none" stroke="#e0e6eb" strokeWidth="13" strokeLinecap="round" />
      </svg>
      <span className="fallback-caption">A PORCELAIN STUDY</span>
    </div>
  );
}
