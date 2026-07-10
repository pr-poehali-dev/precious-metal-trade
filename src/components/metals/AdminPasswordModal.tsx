interface AdminPasswordModalProps {
  passwordInput: string;
  setPasswordInput: (v: string) => void;
  passwordError: boolean;
  setPasswordError: (v: boolean) => void;
  onSubmit: () => void;
  onClose: () => void;
}

const AdminPasswordModal = ({
  passwordInput,
  setPasswordInput,
  passwordError,
  setPasswordError,
  onSubmit,
  onClose,
}: AdminPasswordModalProps) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white p-8 max-w-sm w-full">
        <h3 className="font-display text-2xl text-[#1A1410] mb-2">Вход для администратора</h3>
        <p className="font-body text-sm text-[#9e9080] mb-6">Введите пароль для изменения цен</p>
        <input
          autoFocus
          type="password"
          value={passwordInput}
          placeholder="Пароль"
          onChange={e => { setPasswordInput(e.target.value); setPasswordError(false); }}
          onKeyDown={e => { if (e.key === "Enter") onSubmit(); if (e.key === "Escape") onClose(); }}
          className={`w-full border px-4 py-3 font-body text-sm text-[#1A1410] focus:outline-none mb-2 ${passwordError ? "border-red-400" : "border-[#ede8df] focus:border-[#A07830]"}`}
        />
        {passwordError && <p className="font-body text-xs text-red-500 mb-4">Неверный пароль</p>}
        <div className="flex gap-3 mt-4">
          <button onClick={onSubmit} className="flex-1 bg-[#A07830] text-white font-body text-sm py-3 tracking-wider hover:bg-[#8a6428] transition-colors">
            Войти
          </button>
          <button onClick={onClose} className="flex-1 border border-[#ede8df] font-body text-sm py-3 text-[#9e9080] hover:border-[#9e9080] transition-colors">
            Отмена
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPasswordModal;
