import React, { useMemo, useState } from "react";

const weekDays = ["Pzt","Sal","Çar","Per","Cum","Cts","Paz"];
const monthNames = ["Ocak","Şubat","Mart","Nisan","Mayıs","Haziran","Temmuz","Ağustos","Eylül","Ekim","Kasım","Aralık"];

const STATUS_STYLES = {
  dolu: "bg-emerald-200 text-emerald-900",
  musait: "bg-blue-200 text-blue-900",
};

const villas = [
  { id: 1, name: "Villa Aden" },
  { id: 2, name: "Villa Lara" },
  { id: 3, name: "Villa Mira" },
  { id: 4, name: "Villa Nera" },
];

const WHATSAPP_NUMBER = "905339134700";

const sampleAvailability = {
  "2026-04-13": { status: "dolu", price: 4500 },
  "2026-04-14": { status: "dolu", price: 4500 },
  "2026-04-15": { status: "dolu", price: 4500 },
};

function formatCurrency(value) {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(value);
}

function toISO(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatDateTR(dateStr) {
  const d = new Date(dateStr);
  return `${d.getDate()} ${monthNames[d.getMonth()]}`;
}

function openWhatsApp(villaName, dateStr) {
  const message = `Merhaba, ${villaName} için ${formatDateTR(dateStr)} tarihini sormak istiyorum. Müsait mi?`;
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
}

function buildMonth(year, monthIndex, availability) {
  const firstDay = new Date(year, monthIndex, 1);
  const lastDay = new Date(year, monthIndex + 1, 0);
  const startOffset = (firstDay.getDay() + 6) % 7;
  const totalCells = Math.ceil((startOffset + lastDay.getDate()) / 7) * 7;

  const cells = [];
  for (let i = 0; i < totalCells; i++) {
    const date = new Date(year, monthIndex, i - startOffset + 1);
    const iso = toISO(date);
    const item = availability[iso];

    cells.push({
      iso,
      day: date.getDate(),
      isCurrentMonth: date.getMonth() === monthIndex,
      status: item?.status ?? "musait",
      price: item?.price ?? 5000,
    });
  }
  return cells;
}

function MonthCard({ year, monthIndex, availability, villaName }) {
  const cells = useMemo(
    () => buildMonth(year, monthIndex, availability),
    [year, monthIndex, availability]
  );

  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm">
      <h3 className="text-center font-semibold mb-3">
        {monthNames[monthIndex]} {year}
      </h3>

      <div className="grid grid-cols-7 text-center text-sm text-gray-500 mb-2">
        {weekDays.map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {cells.map((c, i) => (
          <button
            key={i}
            disabled={c.status === "dolu"}
            onClick={() => openWhatsApp(villaName, c.iso)}
            className={`p-2 rounded-lg text-center text-xs transition ${
              c.isCurrentMonth ? STATUS_STYLES[c.status] : "bg-gray-100"
            } ${c.status === "dolu" ? "opacity-60 cursor-not-allowed" : "hover:scale-105"}`}
          >
            <div className="font-bold">{c.day}</div>
            <div>{formatCurrency(c.price)}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function PlusPicaSimple() {
  const [selectedVilla, setSelectedVilla] = useState(villas[0]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">PlusPica</h1>

      <div className="flex gap-3 mb-6">
        {villas.map((villa) => (
          <button
            key={villa.id}
            onClick={() => setSelectedVilla(villa)}
            className={`px-4 py-2 rounded-lg border ${
              selectedVilla.id === villa.id
                ? "bg-black text-white"
                : "bg-white"
            }`}
          >
            {villa.name}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <MonthCard
          year={2026}
          monthIndex={3}
          availability={sampleAvailability}
          villaName={selectedVilla.name}
        />
        <MonthCard
          year={2026}
          monthIndex={4}
          availability={sampleAvailability}
          villaName={selectedVilla.name}
        />
      </div>
    </div>
  );
}
