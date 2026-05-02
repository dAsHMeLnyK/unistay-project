import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiMapPin,
  FiCalendar,
  FiUser,
  FiPhone,
  FiNavigation,
  FiMessageSquare,
  FiUsers,
} from "react-icons/fi";
import { ChatService } from "../../../api/services/ChatService";
import { useAuth } from "../../../context/AuthContext";
import Button from "../../../components/common/Button/Button";
import Card from "../../../components/common/Card/Card";
import styles from "./ListingMainInfo.module.css";
import { ChatType } from "../../../api/dto/ChatDto";
import CreateGroupModal from "./CreateGroupModal/CreateGroupModal";

const ListingMainInfo = ({ listing }) => {
  const [showPhone, setShowPhone] = useState(false);
  const [isCreatingChat, setIsCreatingChat] = useState(false);
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const navigate = useNavigate();
  const { userId } = useAuth();
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);

  const rawPhone = listing.user?.phoneNumber || "";
  const cleanPhone = rawPhone.replace(/\D/g, "");

  const handleStartChat = async () => {
    if (userId && listing.userId.toLowerCase() === userId.toLowerCase()) {
      alert("Це ваше оголошення. Ви не можете почати чат із самим собою.");
      return;
    }

    setIsCreatingChat(true);
    try {
      const myChats = await ChatService.getUserChats();

      const existingChat = myChats.find(
        (chat) =>
          chat.type === ChatType.Private &&
          chat.members.some(
            (m) => m.userId.toLowerCase() === listing.userId.toLowerCase(),
          ),
      );

      if (existingChat) {
        navigate("/messages", { state: { selectedChatId: existingChat.id } });
        return;
      }

      // Виправлено: додано зворотні лапки (backticks)
      const newChat = await ChatService.createChat({
        name: `Обговорення: ${listing.title}`,
        description: `Чат щодо оголошення за адресою: ${listing.address}`,
        type: ChatType.Private,
        targetUserId: listing.userId,
      });

      navigate("/messages", { state: { selectedChatId: newChat.id } });
    } catch (error) {
      console.error("Error starting chat:", error);
      alert("Не вдалося почати діалог. Спробуйте пізніше.");
    } finally {
      setIsCreatingChat(false);
    }
  };

  const handleOpenGroupModal = () => {
    if (userId && listing.userId.toLowerCase() === userId.toLowerCase()) {
      alert("Це ваше оголошення. Ви не можете створити групу із самим собою.");
      return;
    }
    setIsGroupModalOpen(true);
  };

  const handleConfirmCreateGroup = async (groupName) => {
    setIsCreatingGroup(true);
    try {
      const newGroupChat = await ChatService.createChat({
        name: groupName,
        description: `Групове обговорення оренди: ${listing.address}`,
        type: ChatType.Group,
        targetUserId: listing.userId,
      });

      navigate("/messages", { state: { selectedChatId: newGroupChat.id } });
    } catch (error) {
      console.error("Error creating group:", error);
      alert("Не вдалося створити групу. Спробуйте пізніше.");
    } finally {
      setIsCreatingGroup(false);
      setIsGroupModalOpen(false);
    }
  };

  const scrollToMap = () => {
    const mapSection = document.getElementById("location-map");
    if (mapSection) {
      mapSection.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <Card className={styles.infoCard} padding="30px">
      <div className={styles.headerSection}>
        <h1 className={styles.title}>{listing.title}</h1>
        <div className={styles.locationRow}>
          <div className={styles.addressWrapper}>
            <FiMapPin className={styles.icon} />
            <span>{listing.address}</span>
          </div>
          <button onClick={scrollToMap} className={styles.mapLink}>
            <FiNavigation /> <span>На карті</span>
          </button>
        </div>
      </div>

      <hr className={styles.divider} />

      <div className={styles.priceBlock}>
        <span className={styles.priceLabel}>Вартість оренди</span>
        <div className={styles.priceValue}>
          {listing.price?.toLocaleString()} ₴{" "}
          <span className={styles.period}>/ міс.</span>
        </div>
      </div>

      <div className={styles.ownerCard}>
        <div className={styles.ownerAvatar}>
          {listing.user?.profileImage ? (
            <img
              src={listing.user.profileImage}
              alt={listing.user.fullName}
              className={styles.avatarImage}
            />
          ) : (
            listing.user?.fullName?.charAt(0) || <FiUser />
          )}
        </div>

        <div className={styles.ownerInfo}>
          <div className={styles.ownerName}>
            {listing.user?.fullName || "Власник"}
          </div>
          <div className={styles.ownerStatus}>На зв'язку в Unistay</div>
        </div>
      </div>

      <div className={styles.actions}>
        {/* 1. ГОЛОВНА ДІЯ: Написати у внутрішній чат */}
        <Button
          fullWidth
          variant="primary"
          onClick={handleStartChat}
          disabled={isCreatingChat || isCreatingGroup}
        >
          <FiMessageSquare />{" "}
          {isCreatingChat ? "Відкриття..." : "Написати власнику"}
        </Button>

        {/* 2. ДРУГОРЯДНА ДІЯ: Показати номер телефону */}
        {!showPhone ? (
          <Button
            fullWidth
            variant="secondary"
            onClick={() => setShowPhone(true)}
          >
            <FiPhone /> Показати телефон
          </Button>
        ) : (
          <div className={styles.phoneRevealed}>
            <a href={`tel:+${cleanPhone}`} className={styles.phoneLink}>
              <FiPhone /> {rawPhone}
            </a>
          </div>
        )}

        {/* 3. ДОДАТКОВА ДІЯ: Створити групу */}
        <div className={styles.groupActionWrapper}>
          <Button
            fullWidth
            variant="outline"
            onClick={handleOpenGroupModal} // ЗМІНЕНО ТУТ
            disabled={isCreatingChat || isCreatingGroup}
          >
            <FiUsers />{" "}
            {isCreatingGroup
              ? "Створення..."
              : "Створити спільний чат з друзями"}
          </Button>
        </div>
      </div>

      <div className={styles.footerMeta}>
        <FiCalendar />{" "}
        <span>
          Опубліковано {new Date(listing.publicationDate).toLocaleDateString()}
        </span>
      </div>

      <CreateGroupModal
        isOpen={isGroupModalOpen}
        onClose={() => setIsGroupModalOpen(false)}
        onConfirm={handleConfirmCreateGroup}
        isLoading={isCreatingGroup}
        defaultName={`Група: ${listing.title}`}
        ownerName={listing.user?.fullName}
      />
    </Card>
  );
};

export default ListingMainInfo;
