import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { RotateCcw, Check, X } from 'lucide-react';
import './styles.css';

const CHARACTERS = [
  { id: 'mac', name: 'Mạc', image: '/assets/characters/mac.png' },
  { id: 'ba-vinh', name: 'Bà Vĩnh', image: '/assets/characters/ba-vinh.png' },
  { id: 'ba-chuc', name: 'Bà Chúc', image: '/assets/characters/ba-chuc.png' },
  { id: 'bang-tam', name: 'Băng Tâm', image: '/assets/characters/bang-tam.png' },
  { id: 'nhan', name: 'Nhạn', image: '/assets/characters/nhan.png' },
  { id: 'ong-thuong', name: 'Ông Thương', image: '/assets/characters/ong-thuong.png' },
];
function shuffleArray(items) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
function getNewOrder(excludedIds = []) {
  const available = CHARACTERS.filter(item => !excludedIds.includes(item.id));
  const orderKey = excludedIds.length ? 'ats-last-retry-order' : 'ats-last-entry-order';
  const previous = localStorage.getItem(orderKey);
  let order = shuffleArray(available);
  if (order.length > 1 && previous) {
    try {
      const previousIds = JSON.parse(previous);
      let attempts = 0;
      while (attempts < 40 && order.map(x => x.id).join('|') === previousIds.join('|')) {
        order = shuffleArray(available);
        attempts++;
      }
    } catch { /* ignore stale storage */ }
  }
  localStorage.setItem(orderKey, JSON.stringify(order.map(x => x.id)));
  return order;
}
function Butterfly({ className = '' }) {
  return <img className={`butterfly ${className}`} src="/assets/brand/dragonfly-ornament.png" alt="" aria-hidden="true" />;
}
function App() {
  const [excluded, setExcluded] = useState([]);
  const [cards, setCards] = useState(() => getNewOrder());
  const [selected, setSelected] = useState(null);
  const [screen, setScreen] = useState('selection');
  const [flipping, setFlipping] = useState(false);
  const remainingCount = CHARACTERS.length - excluded.length;

  const chooseCharacter = character => {
    if (selected || flipping) return;
    setSelected(character);
    setFlipping(true);
    window.setTimeout(() => { setFlipping(false); setScreen('owner'); }, 1050);
  };
  const startRetry = () => {
    if (!selected) return;
    const nextExcluded = [...excluded, selected.id];
    setExcluded(nextExcluded);
    setSelected(null);
    if (nextExcluded.length >= CHARACTERS.length) {
      setCards([]);
      setScreen('empty');
      return;
    }
    setCards(getNewOrder(nextExcluded));
    setScreen('selection');
  };
  const resetGame = () => {
    setExcluded([]); setSelected(null);
    setCards(getNewOrder()); setScreen('selection');
  };
  return (
    <main className={`app-shell screen-${screen}`}>
      <div className="paper-texture" aria-hidden="true" />
      <div className="paper-cloud cloud-one" aria-hidden="true" />
      <div className="paper-cloud cloud-two" aria-hidden="true" />
      <header className="topbar" aria-label="Án Trong Sương">
        <img className="header-logo" src="/assets/brand/logo-gold.png" alt="Án Trong Sương" />
      </header>

      {screen === 'selection' && <section className="selection-screen">
        <div className="section-heading">
          <Butterfly className="heading-butterfly" />
          <h1>Chọn một lá bài</h1>
          <p>Hãy chọn một lá bài. Mỗi lá bài ẩn giấu một thân phận.</p>
        </div>
        <div className="card-table">
          {cards.map((character, index) => <button type="button" key={character.id}
            className={`card-slot slot-${index}`} onClick={() => chooseCharacter(character)}
            disabled={!!selected || flipping} aria-label={`Chọn lá bài ${index + 1}`}>
            <span className={`card-rotator ${selected?.id === character.id && flipping ? 'is-flipping-card' : ''}`}>
              <span className="card-face card-face-back"><img src="/assets/cards/card-back.png" alt="Mặt sau thẻ Án Trong Sương" /></span>
              <span className="card-face card-face-front"><img src={character.image} alt={`Thẻ nhân vật ${character.name}`} /></span>
            </span>
          </button>)}
        </div>
        <div className="selection-status"><span className="pulse-dot" />
          {remainingCount === 6 ? 'CHỌN MỘT LÁ BÀI ĐỂ MỞ HỒ SƠ' : `CÒN ${remainingCount} LÁ BÀI CHƯA ĐƯỢC KIỂM TRA`}
        </div>
      </section>}

      {screen === 'owner' && selected && <section className="workflow-screen">
        <div className="workflow-heading">
          <Butterfly className="small-butterfly" />
          <p className="eyebrow">HỒ SƠ NHÂN VẬT ĐÃ MỞ</p>
          <h1>Thân phận được hé lộ</h1>
        </div>
        <div className="owner-layout">
          <div className="selected-character-card">
            <img src={selected.image} alt={`Thẻ nhân vật ${selected.name}`} />
          </div>
          <div className="owner-panel">
            <span className="panel-kicker">NHÂN VẬT ĐƯỢC CHỌN</span>
            <h2>{selected.name}</h2>
            <div className="instruction-card">
              <Butterfly className="instruction-butterfly" />
              <p>Nếu lá bài nhân vật này thuộc về một người chơi khác, hãy để người đó xòe hai lá <b>Địa điểm</b> và <b>Hung khí</b>, rồi cho bạn xem <b>một trong hai lá</b>.</p>
              <p>Nếu lá bài thuộc về bạn hoặc không có ai sở hữu, hãy chọn lại để mở một nhân vật khác.</p>
            </div>
            <div className="action-row">
              <button className="secondary-button" onClick={startRetry}><RotateCcw size={16} /> CHỌN LẠI</button>
              <button className="primary-button" onClick={() => setScreen('finished')}><Check size={16} /> KẾT THÚC</button>
            </div>
          </div>
        </div>
        <p className="remaining-note">CÒN {remainingCount - 1} LÁ NHÂN VẬT CÓ THỂ CHỌN NẾU CẦN THỬ LẠI</p>
      </section>}

      {screen === 'finished' && <section className="end-screen">
        <Butterfly className="end-butterfly" /><p className="eyebrow">LƯỢT ĐIỀU TRA ĐÃ HOÀN TẤT</p>
        <h1>Mời mọi người<br />tiếp tục màn chơi</h1>
        <p className="end-copy">Thông tin cần thiết đã được hé lộ. Hãy tiếp tục suy luận và tìm ra bí mật ẩn sau màn sương.</p>
        <div className="end-seal">ÁN TRONG SƯƠNG</div>
        <button className="primary-button close-button" onClick={resetGame}><X size={16} /> ĐÓNG</button>
      </section>}

      {screen === 'empty' && <section className="end-screen">
        <Butterfly className="end-butterfly" /><p className="eyebrow">HỒ SƠ ĐÃ ĐƯỢC KIỂM TRA</p>
        <h1>Không còn lá bài<br />để lựa chọn</h1>
        <p className="end-copy">Cả sáu nhân vật đã được kiểm tra trong lượt này. Hãy bắt đầu lại một lượt điều tra mới.</p>
        <button className="primary-button close-button" onClick={resetGame}><RotateCcw size={16} /> BẮT ĐẦU LẠI</button>
      </section>}
    </main>
  );
}
createRoot(document.getElementById('root')).render(<App />);
