import { useState, useMemo } from "react";
import Icon from "@/components/ui/icon";

interface Room {
  id: string;
  number: string;
  name: string;
  teacher?: string;
  type: "classroom" | "lab" | "admin" | "service" | "hall";
  floor: number;
  x: number;
  y: number;
  width: number;
  height: number;
  description?: string;
}

const ROOMS: Room[] = [
  // === ЭТАЖ 1 (ViewBox 580×620) ===
  // Верхний блок: кабинеты 109–105 (y=10..108, ширина 86, x шаг 94)
  { id: "r109", number: "109", name: "Кабинет 109", type: "classroom", floor: 1, x: 10,  y: 10,  width: 84, height: 98 },
  { id: "r108", number: "108", name: "Кабинет 108", type: "classroom", floor: 1, x: 102, y: 10,  width: 84, height: 98 },
  { id: "r107", number: "107", name: "Кабинет 107", type: "classroom", floor: 1, x: 194, y: 10,  width: 84, height: 98 },
  { id: "r106", number: "106", name: "Кабинет 106", type: "classroom", floor: 1, x: 286, y: 10,  width: 84, height: 98 },
  { id: "r105", number: "105", name: "Кабинет 105", type: "classroom", floor: 1, x: 378, y: 10,  width: 84, height: 98 },
  // Санузлы (левый блок, под 109, y=140..225)
  { id: "r1su1", number: "—",  name: "С/У",          type: "service",  floor: 1, x: 10,  y: 140, width: 50, height: 40 },
  { id: "r1su2", number: "—",  name: "С/У",          type: "service",  floor: 1, x: 10,  y: 184, width: 50, height: 40 },
  // Правый столбец x=492 (внутри правого блока x=484, w=88)
  { id: "r1vrach",  number: "—",   name: "Врач",       type: "service",  floor: 1, x: 492, y: 10,  width: 72, height: 50, description: "Кабинет врача" },
  { id: "r1med",    number: "—",   name: "Медпункт",   type: "service",  floor: 1, x: 492, y: 66,  width: 72, height: 50, description: "Медицинский пункт" },
  { id: "r1razd1",  number: "—",   name: "Раздевалка", type: "hall",     floor: 1, x: 492, y: 140, width: 72, height: 96, description: "Раздевалка" },
  { id: "r1razd2",  number: "—",   name: "Раздевалка", type: "hall",     floor: 1, x: 492, y: 244, width: 72, height: 96, description: "Раздевалка" },
  { id: "r103",     number: "103", name: "Кабинет 103", type: "classroom", floor: 1, x: 492, y: 348, width: 72, height: 80 },
  { id: "r104",     number: "104", name: "Кабинет 104", type: "classroom", floor: 1, x: 492, y: 436, width: 72, height: 80 },
  { id: "r1psych",  number: "—",   name: "Психолог",   type: "service",  floor: 1, x: 492, y: 524, width: 72, height: 76, description: "Кабинет школьного психолога" },
  // Нижний блок: заход + 101 + столовая + 102 (y=307..455, x=56..430)
  { id: "r101",   number: "101", name: "Кабинет 101", type: "classroom", floor: 1, x: 56,  y: 307, width: 86, height: 145, description: "Учебный кабинет" },
  { id: "r1cafe", number: "—",   name: "Столовая",    type: "hall",      floor: 1, x: 150, y: 307, width: 184, height: 145, description: "Школьная столовая" },
  { id: "r102",   number: "102", name: "Кабинет 102", type: "classroom", floor: 1, x: 342, y: 307, width: 86, height: 145 },
  // Этаж 2
  { id: "r201", number: "201", name: "Русский язык", teacher: "Белова О.Г.", type: "classroom", floor: 2, x: 20, y: 20, width: 100, height: 70 },
  { id: "r202", number: "202", name: "Литература", teacher: "Белова О.Г.", type: "classroom", floor: 2, x: 140, y: 20, width: 100, height: 70 },
  { id: "r203", number: "203", name: "Английский", teacher: "Смирнова К.В.", type: "classroom", floor: 2, x: 260, y: 20, width: 100, height: 70 },
  { id: "r204", number: "204", name: "Немецкий", teacher: "Попова Л.Ф.", type: "classroom", floor: 2, x: 380, y: 20, width: 100, height: 70 },
  { id: "r205", number: "205", name: "Информатика", teacher: "Козлов Р.М.", type: "lab", floor: 2, x: 500, y: 20, width: 110, height: 70, description: "Компьютерный класс (30 ПК)" },
  { id: "r206", number: "206", name: "География", teacher: "Фёдорова В.И.", type: "classroom", floor: 2, x: 20, y: 140, width: 100, height: 60 },
  { id: "r207", number: "207", name: "ИЗО", teacher: "Новиков С.А.", type: "classroom", floor: 2, x: 140, y: 140, width: 100, height: 60 },
  { id: "r208", number: "208", name: "Музыка", teacher: "Орлова М.Б.", type: "classroom", floor: 2, x: 260, y: 140, width: 100, height: 60, description: "Кабинет музыки с пианино" },
  { id: "r2conf", number: "—", name: "Актовый зал", type: "hall", floor: 2, x: 380, y: 140, width: 230, height: 60, description: "Актовый зал, вместимость 200 человек" },
  // Этаж 3
  { id: "r301", number: "301", name: "Математика", teacher: "Волков П.Е.", type: "classroom", floor: 3, x: 20, y: 20, width: 100, height: 70 },
  { id: "r302", number: "302", name: "Физика", teacher: "Захаров Г.Л.", type: "lab", floor: 3, x: 140, y: 20, width: 100, height: 70 },
  { id: "r303", number: "303", name: "Обществознание", teacher: "Лебедева С.Ю.", type: "classroom", floor: 3, x: 260, y: 20, width: 100, height: 70 },
  { id: "r304", number: "304", name: "Экономика", teacher: "Соколов А.П.", type: "classroom", floor: 3, x: 380, y: 20, width: 100, height: 70 },
  { id: "r305", number: "305", name: "Технология", teacher: "Медведев Н.С.", type: "lab", floor: 3, x: 500, y: 20, width: 110, height: 70, description: "Мастерская, работа с материалами" },
  { id: "r3admin", number: "—", name: "Завуч", type: "admin", floor: 3, x: 20, y: 140, width: 100, height: 60, description: "Кабинет заместителя директора" },
  { id: "r3psych", number: "—", name: "Психолог", type: "service", floor: 3, x: 140, y: 140, width: 100, height: 60, description: "Кабинет школьного психолога" },
  { id: "r3copy", number: "—", name: "Копицентр", type: "service", floor: 3, x: 260, y: 140, width: 100, height: 60 },
  { id: "r3rec", number: "—", name: "Рекреация", type: "hall", floor: 3, x: 380, y: 140, width: 230, height: 60, description: "Зона отдыха для учеников" },
];

const TYPE_CONFIG = {
  classroom: { color: "#EFF6FF", stroke: "#BFDBFE", activeColor: "#2563EB", label: "Класс", icon: "BookOpen" },
  lab:       { color: "#F0FDF4", stroke: "#BBF7D0", activeColor: "#16A34A", label: "Лаборатория", icon: "FlaskConical" },
  admin:     { color: "#FFF7ED", stroke: "#FED7AA", activeColor: "#EA580C", label: "Администрация", icon: "Briefcase" },
  service:   { color: "#F5F3FF", stroke: "#DDD6FE", activeColor: "#7C3AED", label: "Служба", icon: "Heart" },
  hall:      { color: "#FFF1F2", stroke: "#FECDD3", activeColor: "#E11D48", label: "Зал / Рекреация", icon: "Users" },
};

const FLOOR_LABELS = ["1 этаж", "2 этаж", "3 этаж"];

export default function Index() {
  const [activeFloor, setActiveFloor] = useState(1);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [highlightId, setHighlightId] = useState<string | null>(null);

  const searchResults = useMemo(() => {
    if (!search.trim()) return [];
    const q = search.toLowerCase();
    return ROOMS.filter(
      (r) =>
        r.number.toLowerCase().includes(q) ||
        r.name.toLowerCase().includes(q) ||
        (r.teacher && r.teacher.toLowerCase().includes(q))
    ).slice(0, 8);
  }, [search]);

  const floorRooms = ROOMS.filter((r) => r.floor === activeFloor);

  const handleSearchSelect = (room: Room) => {
    setSearch(room.number !== "—" ? `${room.number} — ${room.name}` : room.name);
    setSearchOpen(false);
    setActiveFloor(room.floor);
    setHighlightId(room.id);
    setSelectedRoom(room);
    setTimeout(() => setHighlightId(null), 2200);
  };

  const handleRoomClick = (room: Room) => {
    setSelectedRoom(selectedRoom?.id === room.id ? null : room);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "hsl(210 20% 98%)", fontFamily: "'Golos Text', sans-serif" }}>
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-5 py-3 flex items-center gap-4 sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "#2563EB" }}>
            <Icon name="School" size={18} className="text-white" />
          </div>
          <div>
            <div className="font-bold text-[15px] leading-none text-gray-900">Школа №42</div>
            <div className="text-[11px] text-gray-400 mt-0.5">Навигация по зданию</div>
          </div>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-lg relative">
          <Icon name="Search" size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setSearchOpen(true); }}
            onFocus={() => setSearchOpen(true)}
            onBlur={() => setTimeout(() => setSearchOpen(false), 150)}
            placeholder="Поиск кабинета, учителя, помещения..."
            className="w-full pl-9 pr-8 py-2.5 text-[14px] rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:border-blue-400 transition-all"
            style={{ "--tw-ring-color": "#3B82F6" } as React.CSSProperties}
          />
          {search && (
            <button
              onClick={() => { setSearch(""); setSelectedRoom(null); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
            >
              <Icon name="X" size={14} />
            </button>
          )}

          {searchOpen && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-fade-in">
              {searchResults.map((room, i) => {
                const cfg = TYPE_CONFIG[room.type];
                return (
                  <button
                    key={room.id}
                    onMouseDown={() => handleSearchSelect(room)}
                    className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left"
                    style={{ borderTop: i > 0 ? "1px solid #F3F4F6" : "none" }}
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: cfg.color }}>
                      <Icon name={cfg.icon} size={14} style={{ color: cfg.activeColor }} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[13px] font-semibold text-gray-900">
                        {room.number !== "—" ? `${room.number} — ` : ""}{room.name}
                      </div>
                      {room.teacher && (
                        <div className="text-[11px] text-gray-400 truncate">{room.teacher}</div>
                      )}
                    </div>
                    <span className="text-[11px] text-gray-400 flex-shrink-0 bg-gray-100 px-2 py-0.5 rounded-full">
                      {FLOOR_LABELS[room.floor - 1]}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
          {searchOpen && search.trim() && searchResults.length === 0 && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-xl shadow-xl border border-gray-100 px-4 py-3 z-50 text-[13px] text-gray-400 animate-fade-in">
              Ничего не найдено по запросу «{search}»
            </div>
          )}
        </div>

        <div className="ml-auto flex items-center gap-1.5 text-[12px] text-gray-400 flex-shrink-0">
          <Icon name="Info" size={13} />
          <span>Нажмите на кабинет</span>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-52 bg-white border-r border-gray-200 flex flex-col py-5 px-3 gap-1 flex-shrink-0 overflow-y-auto">
          <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-2 mb-1">Этажи</div>
          {FLOOR_LABELS.map((label, i) => {
            const count = ROOMS.filter((r) => r.floor === i + 1).length;
            const active = activeFloor === i + 1;
            return (
              <button
                key={i}
                onClick={() => { setActiveFloor(i + 1); setSelectedRoom(null); }}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[14px] font-medium transition-all"
                style={active
                  ? { background: "#2563EB", color: "white" }
                  : { color: "#374151", background: "transparent" }
                }
                onMouseEnter={(e) => !active && ((e.currentTarget as HTMLElement).style.background = "#F3F4F6")}
                onMouseLeave={(e) => !active && ((e.currentTarget as HTMLElement).style.background = "transparent")}
              >
                <Icon name="Layers" size={15} />
                <span>{label}</span>
                <span className="ml-auto text-[11px] rounded-full px-1.5 py-0.5 font-semibold"
                  style={active
                    ? { background: "rgba(255,255,255,0.25)", color: "white" }
                    : { background: "#F3F4F6", color: "#9CA3AF" }
                  }>
                  {count}
                </span>
              </button>
            );
          })}

          <div className="mt-5 text-[10px] font-bold uppercase tracking-widest text-gray-400 px-2 mb-1">Легенда</div>
          {Object.entries(TYPE_CONFIG).map(([type, cfg]) => (
            <div key={type} className="flex items-center gap-2.5 px-2 py-1.5">
              <div className="w-4 h-4 rounded flex-shrink-0 border" style={{ background: cfg.color, borderColor: cfg.stroke }} />
              <span className="text-[12px] text-gray-500">{cfg.label}</span>
            </div>
          ))}
        </aside>

        {/* Map */}
        <main className="flex-1 overflow-auto p-5">
          <div className="mb-4 flex items-center gap-3">
            <h2 className="text-[20px] font-bold text-gray-900">{FLOOR_LABELS[activeFloor - 1]}</h2>
            <span className="text-[13px] text-gray-400 bg-white border border-gray-200 px-3 py-1 rounded-full">
              {floorRooms.length} помещений
            </span>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden" key={`floor-${activeFloor}`} style={{ animation: "fadeIn 0.25s ease-out" }}>
            <svg
              viewBox={activeFloor === 1 ? "0 0 580 620" : "0 0 660 300"}
              className="w-full"
              style={{ minHeight: activeFloor === 1 ? 480 : 260 }}
            >
              {activeFloor === 1 ? (
                /* ===== 1 ЭТАЖ: Г-образный план точно по схеме эвакуации ===== */
                <g fontFamily="Golos Text, sans-serif">
                  {/* ===== Контур Г-образного здания =====
                      ViewBox: 580 × 620
                      Верхний блок  (кабинеты 105–109 + врач/мед):  x=8, y=8,   w=564, h=225
                      Правый столбец (врач, мед, раздевалки, 103,104, психолог): x=484, y=8, w=88, h=594
                      Нижний левый блок (заход, 101, столовая, 102): x=8, y=287, w=436, h=170
                  */}
                  <rect x="8"   y="8"   width="564" height="225" rx="6" fill="#EEF2F7" stroke="#94A3B8" strokeWidth="2.5"/>
                  <rect x="484" y="8"   width="88"  height="604" rx="6" fill="#EEF2F7" stroke="#94A3B8" strokeWidth="2.5"/>
                  <rect x="8"   y="287" width="436" height="172" rx="6" fill="#EEF2F7" stroke="#94A3B8" strokeWidth="2.5"/>

                  {/* Коридор горизонтальный верхний */}
                  <rect x="8"   y="116" width="476" height="20" fill="#D1D9E6"/>
                  <text x="18" y="129" fontSize="7.5" fill="#64748B" fontWeight="700" letterSpacing="1.5">К О Р И Д О Р</text>
                  {/* Коридор правый горизонтальный (продолжение) */}
                  <rect x="484" y="116" width="88"  height="20" fill="#D1D9E6"/>
                  {/* Коридор вертикальный правый */}
                  <rect x="484" y="136" width="20"  height="380" fill="#D1D9E6"/>
                  {/* Коридор нижний горизонтальный */}
                  <rect x="8"   y="287" width="436" height="20" fill="#D1D9E6"/>
                  <text x="18" y="300" fontSize="7.5" fill="#64748B" fontWeight="700" letterSpacing="1.5">К О Р И Д О Р</text>

                  {/* Выходы */}
                  <rect x="62"  y="104" width="52" height="16" rx="3" fill="#15803D"/>
                  <text x="88"  y="115" fontSize="8" fill="white" fontWeight="700" textAnchor="middle">ВЫХОД</text>
                  <rect x="284" y="104" width="52" height="16" rx="3" fill="#15803D"/>
                  <text x="310" y="115" fontSize="8" fill="white" fontWeight="700" textAnchor="middle">ВЫХОД</text>
                  <rect x="519" y="104" width="52" height="16" rx="3" fill="#15803D"/>
                  <text x="545" y="115" fontSize="8" fill="white" fontWeight="700" textAnchor="middle">ВЫХОД</text>
                  <rect x="519" y="278" width="52" height="16" rx="3" fill="#15803D"/>
                  <text x="545" y="289" fontSize="8" fill="white" fontWeight="700" textAnchor="middle">ВЫХОД</text>
                  <rect x="62"  y="275" width="52" height="16" rx="3" fill="#15803D"/>
                  <text x="88"  y="286" fontSize="8" fill="white" fontWeight="700" textAnchor="middle">ВЫХОД</text>
                  <rect x="270" y="450" width="52" height="16" rx="3" fill="#15803D"/>
                  <text x="296" y="461" fontSize="8" fill="white" fontWeight="700" textAnchor="middle">ВЫХОД</text>

                  {/* Заход */}
                  <rect x="8"   y="305" width="46" height="72" rx="4" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="1.5"/>
                  <text x="31"  y="335" fontSize="8" fill="#92400E" fontWeight="700" textAnchor="middle">ЗА-</text>
                  <text x="31"  y="347" fontSize="8" fill="#92400E" fontWeight="700" textAnchor="middle">ХОД</text>
                  {/* Лестница */}
                  <rect x="448" y="238" width="28" height="40" rx="3" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1"/>
                  <text x="462" y="255" fontSize="6.5" fill="#64748B" textAnchor="middle">ЛЕСТ</text>
                  <text x="462" y="265" fontSize="6.5" fill="#64748B" textAnchor="middle">НИЦА</text>

                  {/* --- Rooms --- */}
                  {floorRooms.map((room) => {
                    const cfg = TYPE_CONFIG[room.type];
                    const isSelected = selectedRoom?.id === room.id;
                    const isHighlighted = highlightId === room.id;
                    const isActive = isSelected || isHighlighted;
                    return (
                      <g key={room.id} style={{ cursor: "pointer" }} onClick={() => handleRoomClick(room)}>
                        <rect x={room.x} y={room.y} width={room.width} height={room.height} rx={5}
                          fill={isActive ? cfg.activeColor : cfg.color}
                          stroke={isActive ? cfg.activeColor : cfg.stroke}
                          strokeWidth={1.5}
                          style={{ transition: "all 0.18s ease" }}
                        />
                        {room.number !== "—" && (
                          <text x={room.x + room.width / 2} y={room.y + room.height / 2 - 7}
                            textAnchor="middle" fontSize="14" fontWeight="700"
                            fill={isActive ? "white" : "#1E293B"}
                            style={{ transition: "fill 0.18s" }}>
                            №{room.number}
                          </text>
                        )}
                        <text x={room.x + room.width / 2}
                          y={room.y + (room.number !== "—" ? room.height / 2 + 10 : room.height / 2 + 5)}
                          textAnchor="middle" fontSize="9"
                          fill={isActive ? "rgba(255,255,255,0.9)" : "#475569"}
                          style={{ transition: "fill 0.18s" }}>
                          {room.name.length > 12 ? room.name.slice(0, 12) + "…" : room.name}
                        </text>
                      </g>
                    );
                  })}
                </g>
              ) : (
                /* ===== 2 и 3 ЭТАЖ ===== */
                <g fontFamily="Golos Text, sans-serif">
                  <rect x="8" y="8" width="644" height="284" rx="10" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="2" />
                  <rect x="8" y="118" width="644" height="20" fill="#E8EEF6" />
                  <text x="20" y="131" fontSize="8.5" fill="#94A3B8" fontWeight="600" letterSpacing="1">К О Р И Д О Р</text>
                  {floorRooms.map((room) => {
                    const cfg = TYPE_CONFIG[room.type];
                    const isSelected = selectedRoom?.id === room.id;
                    const isHighlighted = highlightId === room.id;
                    const isActive = isSelected || isHighlighted;
                    return (
                      <g key={room.id} style={{ cursor: "pointer" }} onClick={() => handleRoomClick(room)}>
                        <rect x={room.x} y={room.y} width={room.width} height={room.height} rx={7}
                          fill={isActive ? cfg.activeColor : cfg.color}
                          stroke={isActive ? cfg.activeColor : cfg.stroke}
                          strokeWidth={1.5}
                          style={{ transition: "all 0.18s ease" }}
                        />
                        {room.number !== "—" && (
                          <text x={room.x + room.width / 2} y={room.y + room.height / 2 - 7}
                            textAnchor="middle" fontSize="14" fontWeight="700"
                            fill={isActive ? "white" : "#1E293B"}
                            style={{ transition: "fill 0.18s" }}>
                            {room.number}
                          </text>
                        )}
                        <text x={room.x + room.width / 2}
                          y={room.y + (room.number !== "—" ? room.height / 2 + 10 : room.height / 2 + 5)}
                          textAnchor="middle" fontSize="9.5"
                          fill={isActive ? "rgba(255,255,255,0.88)" : "#64748B"}
                          style={{ transition: "fill 0.18s" }}>
                          {room.name.length > 13 ? room.name.slice(0, 13) + "…" : room.name}
                        </text>
                      </g>
                    );
                  })}
                </g>
              )}
            </svg>
          </div>

          {/* Detail card */}
          {selectedRoom && (
            <div
              className="mt-4 bg-white rounded-2xl border border-gray-200 p-5"
              style={{ animation: "slideUp 0.25s ease-out", boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3.5">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: TYPE_CONFIG[selectedRoom.type].color }}
                  >
                    <Icon
                      name={TYPE_CONFIG[selectedRoom.type].icon}
                      size={20}
                      style={{ color: TYPE_CONFIG[selectedRoom.type].activeColor }}
                    />
                  </div>
                  <div>
                    <div className="font-bold text-[18px] text-gray-900 leading-tight">
                      {selectedRoom.number !== "—" ? `Кабинет ${selectedRoom.number}` : selectedRoom.name}
                    </div>
                    {selectedRoom.number !== "—" && (
                      <div className="text-[13px] text-gray-400 mt-0.5">{selectedRoom.name}</div>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedRoom(null)}
                  className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors flex-shrink-0"
                >
                  <Icon name="X" size={13} className="text-gray-500" />
                </button>
              </div>

              <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2.5">
                <div className="flex items-center gap-2">
                  <Icon name="Layers" size={14} className="text-gray-400" />
                  <span className="text-[13px] text-gray-500">Этаж:</span>
                  <span className="text-[13px] font-semibold text-gray-800">{FLOOR_LABELS[selectedRoom.floor - 1]}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="Tag" size={14} className="text-gray-400" />
                  <span className="text-[13px] text-gray-500">Тип:</span>
                  <span className="text-[13px] font-semibold text-gray-800">{TYPE_CONFIG[selectedRoom.type].label}</span>
                </div>
                {selectedRoom.teacher && (
                  <div className="flex items-center gap-2">
                    <Icon name="User" size={14} className="text-gray-400" />
                    <span className="text-[13px] text-gray-500">Учитель:</span>
                    <span className="text-[13px] font-semibold text-gray-800">{selectedRoom.teacher}</span>
                  </div>
                )}
                {selectedRoom.description && (
                  <div className="w-full flex items-start gap-2 mt-1">
                    <Icon name="Info" size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
                    <span className="text-[13px] text-gray-500">{selectedRoom.description}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}