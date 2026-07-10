import { useState } from "react";
import { METALS } from "@/data/metals";

const ContactForm = () => {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [metal, setMetal] = useState("");
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");

  const submit = async () => {
    if (!name.trim() || !contact.trim()) return;
    setStatus("loading");
    try {
      const res = await fetch("https://functions.poehali.dev/9009c010-2fa3-4c6b-8331-52eea5618f2d", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, contact, metal, comment }),
      });
      if (res.ok) {
        setStatus("ok");
        setName(""); setContact(""); setMetal(""); setComment("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <input
        placeholder="Ваше имя"
        value={name}
        onChange={e => setName(e.target.value)}
        className="border border-[#ede8df] bg-white px-4 py-3 font-body text-sm text-[#1A1410] placeholder:text-[#c0b8ae] focus:outline-none focus:border-[#A07830] transition-colors"
      />
      <input
        placeholder="Телефон или email"
        value={contact}
        onChange={e => setContact(e.target.value)}
        className="border border-[#ede8df] bg-white px-4 py-3 font-body text-sm text-[#1A1410] placeholder:text-[#c0b8ae] focus:outline-none focus:border-[#A07830] transition-colors"
      />
      <select
        value={metal}
        onChange={e => setMetal(e.target.value)}
        className="border border-[#ede8df] bg-white px-4 py-3 font-body text-sm text-[#6b5e52] focus:outline-none focus:border-[#A07830] transition-colors"
      >
        <option value="">Интересующий металл</option>
        {METALS.map(m => <option key={m.id} value={m.name}>{m.name}</option>)}
      </select>
      <textarea
        placeholder="Комментарий или вопрос"
        rows={4}
        value={comment}
        onChange={e => setComment(e.target.value)}
        className="border border-[#ede8df] bg-white px-4 py-3 font-body text-sm text-[#1A1410] placeholder:text-[#c0b8ae] focus:outline-none focus:border-[#A07830] transition-colors resize-none"
      />
      {status === "ok" && (
        <p className="font-body text-sm text-green-600">Заявка отправлена! Мы свяжемся с вами.</p>
      )}
      {status === "error" && (
        <p className="font-body text-sm text-red-500">Ошибка отправки. Попробуйте ещё раз или свяжитесь напрямую.</p>
      )}
      <button
        onClick={submit}
        disabled={status === "loading"}
        className="bg-[#A07830] text-white font-body text-sm py-3 tracking-wider hover:bg-[#8a6428] transition-colors disabled:opacity-60"
      >
        {status === "loading" ? "Отправка..." : "Отправить заявку"}
      </button>
    </div>
  );
};

export default ContactForm;
