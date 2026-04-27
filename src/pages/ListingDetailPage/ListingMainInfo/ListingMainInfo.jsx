import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiMapPin,
  FiCalendar,
  FiUser,
  FiPhone,
  FiNavigation,
  FiMessageSquare,
} from "react-icons/fi";
import { ChatService } from "../../../api/services/ChatService";
import { useAuth } from "../../../context/AuthContext"; 
import Button from "../../../components/common/Button/Button";
import Card from "../../../components/common/Card/Card";
import styles from "./ListingMainInfo.module.css";
import { ChatType, ChatMemberRole } from "../../../api/dto/ChatDto";

const ListingMainInfo = ({ listing }) => {
  const [showPhone, setShowPhone] = useState(false);
  const [isCreatingChat, setIsCreatingChat] = useState(false);
  const navigate = useNavigate();
  const { userId } = useAuth(); 

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
            (m) => m.userId.toLowerCase() === listing.userId.toLowerCase()
          )
      );

      if (existingChat) {
        navigate("/messages", { state: { selectedChatId: existingChat.id } });
        return;
      }

      const newChat = await ChatService.createChat({
        name: `Обговорення: ${listing.title}`,
        description: `Чат щодо оголошення за адресою: ${listing.address}`,
        type: ChatType.Private,
      });

      try {
        await ChatService.addMember(newChat.id, {
          targetUserId: listing.userId,
          role: ChatMemberRole.Member,
        });

        navigate("/messages", { state: { selectedChatId: newChat.id } });
      } catch (memberError) {
        console.error("Failed to add owner to chat:", memberError);
        alert("Чат створено, але не вдалося автоматично додати власника.");
        navigate("/messages", { state: { selectedChatId: newChat.id } });
      }

    } catch (error) {
      console.error("Error starting chat:", error);
      alert("Не вдалося почати діалог. Спробуйте пізніше.");
    } finally {
      setIsCreatingChat(false);
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
        {/* ОНОВЛЕНИЙ БЛОК АВАТАРА */}
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
        {!showPhone ? (
          <Button
            fullWidth
            variant="primary"
            onClick={() => setShowPhone(true)}
          >
            <FiPhone /> Показати контакти
          </Button>
        ) : (
          <div className={styles.contactExpanded}>
            <a href={`tel:+${cleanPhone}`} className={styles.phoneCallLink}>
              <FiPhone /> {rawPhone}
            </a>
            <div className={styles.messengerGrid}>
              <a
                href={`https://t.me/+${cleanPhone}`}
                target="_blank"
                rel="noreferrer"
                className={`${styles.messengerBtn} ${styles.tg}`}
              >
                TG
              </a>
              <a
                href={`viber://chat?number=%2B${cleanPhone}`}
                className={`${styles.messengerBtn} ${styles.viber}`}
              >
                Viber
              </a>
            </div>
          </div>
        )}

        <Button
          fullWidth
          variant="secondary"
          onClick={handleStartChat}
          disabled={isCreatingChat}
        >
          <FiMessageSquare />{" "}
          {isCreatingChat ? "Створення..." : "Написати повідомлення"}
        </Button>
      </div>

      <div className={styles.footerMeta}>
        <FiCalendar />{" "}
        <span>
          Опубліковано {new Date(listing.publicationDate).toLocaleDateString()}
        </span>
      </div>
    </Card>
  );
};

export default ListingMainInfo;