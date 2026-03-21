import { useState } from "react";
import { type Page } from "@/App";
import Icon from "@/components/ui/icon";

interface Props {
  navigate: (p: Page) => void;
}

const faqs = [
  { q: "Что такое D-COIN?", a: "D-COIN — виртуальная валюта платформы DCOIN Casino. Она не имеет реальной денежной стоимости и используется только для игр на платформе." },
  { q: "Как начать играть?", a: "Зарегистрируйся, получи 1000 D-COIN стартовый бонус и выбери любую игру в разделе 'Игры'. Всё просто!" },
  { q: "Можно ли вывести D-COIN?", a: "Нет. D-COIN — исключительно виртуальная валюта для игр. Вывод в реальные деньги невозможен и не предусмотрен." },
  { q: "Как получить больше D-COIN?", a: "Играй и выигрывай, получай ежедневные бонусы, выполняй задания, используй промокоды и поднимайся по уровням." },
  { q: "Что дают подписки VIP/Premium/Elite?", a: "Подписки дают стартовые бонусы, увеличенные награды, уникальные аватары и доступ к эксклюзивным турнирам. Оформляются за D-COIN." },
  { q: "Игры честные?", a: "Да! Все результаты генерируются случайным образом. Алгоритмы прозрачны и не манипулируют результатами." },
];

const rules = [
  { icon: "Shield", title: "Возрастное ограничение", text: "Платформа предназначена для пользователей 18+. Регистрируясь, ты подтверждаешь свой возраст." },
  { icon: "Ban", title: "Запрет мошенничества", text: "Использование читов, ботов и других нечестных методов ведёт к немедленной блокировке аккаунта." },
  { icon: "Users", title: "Один аккаунт", text: "Каждый пользователь может иметь только один аккаунт. Дублирующие аккаунты блокируются." },
  { icon: "Heart", title: "Ответственная игра", text: "Если ты чувствуешь зависимость от игр — сделай перерыв. Это всего лишь развлечение!" },
];

export default function InfoPage({ navigate }: Props) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">

      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="font-orbitron text-4xl font-black text-white mb-3">
          ℹ️ <span className="neon-text-blue">Информация</span>
        </h1>
        <p className="text-gray-400 font-exo">Всё, что нужно знать о DCOIN Casino</p>
      </div>

      {/* About */}
      <div className="card-game p-8 mb-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-purple-600/5 blur-3xl pointer-events-none" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center text-2xl">
              🎰
            </div>
            <div>
              <h2 className="font-orbitron text-xl font-bold text-white">DCOIN Casino</h2>
              <p className="text-xs text-purple-400 font-exo">Футуристичная игровая платформа</p>
            </div>
          </div>
          <p className="text-gray-400 font-exo leading-relaxed mb-4">
            DCOIN Casino — это бесплатная игровая платформа на виртуальной валюте D-COIN.
            Никаких реальных денег, только чистое удовольствие от игры! Регистрируйся,
            получай бонусы, играй в разнообразные игры и соревнуйся с другими игроками.
          </p>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Игр", value: "6+" },
              { label: "Игроков", value: "12K+" },
              { label: "D-COIN выдано", value: "50M+" },
            ].map((s) => (
              <div key={s.label} className="glass rounded-xl p-3 text-center">
                <div className="font-orbitron text-xl font-bold neon-text-purple">{s.value}</div>
                <div className="text-xs text-gray-500 font-exo">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Rules */}
      <div className="mb-6">
        <h2 className="font-orbitron text-xl font-bold text-white mb-4">
          📋 <span className="neon-text-purple">Правила</span> платформы
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {rules.map((r) => (
            <div key={r.title} className="card-game p-5 flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/20 flex items-center justify-center shrink-0">
                <Icon name={r.icon as "Shield"} size={18} className="text-purple-400" />
              </div>
              <div>
                <h3 className="font-exo font-bold text-white text-sm mb-1">{r.title}</h3>
                <p className="text-xs text-gray-500 font-exo leading-relaxed">{r.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="mb-6">
        <h2 className="font-orbitron text-xl font-bold text-white mb-4">
          ❓ <span className="neon-text-blue">Частые</span> вопросы
        </h2>
        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <div key={i} className="card-game overflow-hidden">
              <button
                className="w-full px-5 py-4 flex items-center justify-between text-left"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <span className="font-exo font-semibold text-white text-sm">{faq.q}</span>
                <Icon
                  name={openFaq === i ? "ChevronUp" : "ChevronDown"}
                  size={16}
                  className="text-purple-400 shrink-0 ml-3"
                />
              </button>
              {openFaq === i && (
                <div className="px-5 pb-4 animate-fade-in">
                  <div className="h-px bg-purple-900/30 mb-3" />
                  <p className="text-gray-400 font-exo text-sm leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Support */}
      <div className="card-game p-6 text-center neon-border-purple border">
        <div className="text-4xl mb-3">💬</div>
        <h2 className="font-orbitron text-xl font-bold text-white mb-2">Нужна помощь?</h2>
        <p className="text-gray-400 font-exo text-sm mb-5">
          Свяжись с нашей поддержкой — ответим в течение 24 часов
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button className="btn-primary px-6 py-3 rounded-xl font-bold font-exo text-sm flex items-center gap-2 justify-center">
            <Icon name="MessageCircle" size={16} />
            Написать в поддержку
          </button>
          <button className="glass border border-purple-500/30 text-purple-300 hover:text-white px-6 py-3 rounded-xl font-bold font-exo text-sm flex items-center gap-2 justify-center transition-all">
            <Icon name="Mail" size={16} />
            support@dcoin.casino
          </button>
        </div>
      </div>
    </div>
  );
}
