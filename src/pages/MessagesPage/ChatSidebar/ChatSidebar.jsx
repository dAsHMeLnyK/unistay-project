import React, { useState, useMemo } from "react"; 
import styles from "./ChatSidebar.module.css"; 
import { ChatType } from "../../../api/dto/ChatDto"; 
import { useAuth } from "../../../context/AuthContext"; 
import { FiSearch } from "react-icons/fi"; 
 
const ChatSidebar = ({ chats, selectedId, onSelect, loading }) => { 
  const { userId: currentUserId } = useAuth(); 
  const [searchQuery, setSearchQuery] = useState(""); 
 
  const processedChats = useMemo(() => { 
    return chats.map((chat) => { 
      let displayName = chat.name; 
      let displayAvatar = null; 
      let subTitle = chat.type === ChatType.Private ? "Приватний чат" : "Групове обговорення"; 
 
      if (chat.type === ChatType.Private) { 
        const interlocutor = chat.members?.find( 
          (m) => m.userId.toLowerCase() !== currentUserId?.toLowerCase(), 
        )?.user; 
 
        if (interlocutor) { 
          displayName = interlocutor.fullName; 
          // ОНОВЛЕНО: profileImage замість avatarUrl
          displayAvatar = interlocutor.profileImage; 
          subTitle = chat.name; 
        } 
      } 
 
      return { ...chat, displayName, displayAvatar, subTitle }; 
    }); 
  }, [chats, currentUserId]); 
 
  const filteredChats = useMemo(() => { 
    const query = searchQuery.toLowerCase().trim(); 
    return processedChats.filter((chat) => 
      chat.displayName?.toLowerCase().includes(query) ||  
      chat.subTitle?.toLowerCase().includes(query) 
    ); 
  }, [processedChats, searchQuery]); 
 
  return ( 
    <aside className={styles.sidebar}> 
      <div className={styles.sidebarHeader}> 
        <div className={styles.headerTop}> 
          <h3 className={styles.title}>Чати</h3> 
          <span className="inner-badge">{chats.length}</span> 
        </div> 
 
        <div className={styles.searchContainer}> 
          <FiSearch className={styles.searchIcon} /> 
          <input 
            type="text" 
            placeholder="Пошук людей або житла..." 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
            className={styles.searchField} 
          /> 
        </div> 
      </div> 
 
      <div className={styles.list}> 
        {loading ? ( 
          <p className={styles.empty}>Завантаження...</p> 
        ) : filteredChats.length > 0 ? ( 
          filteredChats.map((chat) => { 
            const date = new Date(chat.updatedAt || chat.createdAt); 
            const isActive = selectedId === chat.id; 
 
            return ( 
              <div 
                key={chat.id} 
                className={`${styles.chatItem} ${isActive ? styles.active : ""}`} 
                onClick={() => onSelect(chat)} 
              > 
                <div className={styles.avatar}> 
                  {chat.displayAvatar ? ( 
                    <img 
                      src={chat.displayAvatar} 
                      alt={chat.displayName} 
                      className={styles.avatarImg} 
                    /> 
                  ) : ( 
                    chat.displayName?.charAt(0).toUpperCase() || "C" 
                  )} 
                </div> 
 
                <div className={styles.chatInfo}> 
                  <div className={styles.chatTopRow}> 
                    <h4 className={styles.chatName}>{chat.displayName}</h4> 
                    <span className={styles.chatTime}> 
                      {date.toLocaleDateString([], { 
                        day: "2-digit", 
                        month: "2-digit", 
                      })} 
                    </span> 
                  </div> 
                  <p className={styles.lastMsg}> 
                    {chat.subTitle} 
                  </p> 
                </div> 
              </div> 
            ); 
          }) 
        ) : ( 
          <div className={styles.empty}> 
            {searchQuery ? "Нічого не знайдено" : "У вас поки немає активних переписок"} 
          </div> 
        )} 
      </div> 
    </aside> 
  ); 
}; 
 
export default ChatSidebar;