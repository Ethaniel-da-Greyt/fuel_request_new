import { useRef } from "react";

interface ModalProps {
  id?: string;
  buttonLabel?: string;
  title?: string;
  children: React.ReactNode;
  className: string;
  onClick?: () => void;
}

const Modal: React.FC<ModalProps> = ({
  buttonLabel = "",
  id,
  title,
  children,
  className,
  onClick,
}) => {
  const modalref = useRef<HTMLDialogElement>(null);

  const openModal = () => {
    if (onClick) {
      onClick();
    }
    modalref.current?.showModal();
  };

  const closeModal = () => modalref.current?.close();

  return (
    <div>
      <button className={className} onClick={openModal}>
        {buttonLabel}
      </button>

      <dialog ref={modalref} className="modal text-left" id={id}>
        <div className="modal-box">
          <form method="dialog">
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={closeModal}
            >
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">{title}</h3>
          <div className="border-b-2 mt-2"></div>
          <div className="">{children}</div>
        </div>
      </dialog>
    </div>
  );
};

export default Modal;
