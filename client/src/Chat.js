import React, { useEffect, useState } from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';

function Chat({ socket, username, room }) {
  // const leftMessage = `${username} LEFT the room`;
  const [currentMessage, setCurrentMessage] = useState('');
  const [messageList, setMessageList] = useState([]);

  const sendMessage = async () => {
    if (currentMessage !== '') {
      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ':' +
          new Date(Date.now()).getMinutes(),
      };
      await socket.emit('send_message', messageData);
      setMessageList(() => [...messageList, messageData]);
      setCurrentMessage('');
    }
  };

  const userDisconnect = async () => {
    const messageData = {
      room: room,
      author: 'admin',
      message: `${username} LEFT the room`,
      time:
        new Date(Date.now()).getHours() +
        ':' +
        new Date(Date.now()).getMinutes(),
    };
    await socket.emit('send_message', messageData);
    setMessageList(() => [...messageList, messageData]);
  };

  useEffect(() => {
    socket.on('receive_message', (data) => {
      setMessageList(() => [...messageList, data]);
      // else setMessageList(() => [...messageList, leftMessage]);
    });
  }, [messageList, socket]);

  useEffect(() => {
    socket.on('disconnect', () => {
      userDisconnect();
    });
  });

  return (
    <div className="chat-window">
      <div className="chat-header">
        <p>NODE | {room}</p>
      </div>
      <div className="chat-body">
        <ScrollToBottom className="message-container">
          {messageList.map((messageContent) => {
            return (
              <div
                className="message"
                id={username === messageContent.author ? 'you' : 'other'}
              >
                <div>
                  <div className="message-content">
                    <p>{messageContent.message}</p>
                  </div>
                  <div className="message-meta">
                    <p className="time">{messageContent.time}</p>
                    <p id="author">{messageContent.author}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </ScrollToBottom>
      </div>
      <div className="chat-footer">
        <input
          type="text"
          value={currentMessage}
          placeholder="Message..."
          onChange={(event) => setCurrentMessage(event.target.value)}
          onKeyPress={(event) => {
            event.key === 'Enter' && sendMessage();
          }}
        />
        <button onClick={sendMessage}>&#9658;</button>
      </div>
    </div>
  );
}

export default Chat;
