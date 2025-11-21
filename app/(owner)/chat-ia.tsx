import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import axiosClient from '../../api/axiosClient';
import colors from '../../styles/colors';
import typography from '../../styles/typography';

type Message = {
  id: string;
  type: 'user' | 'ai';
  text: string;
  timestamp: string;
};

export default function ChatIA() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      type: 'ai',
      text: '¡Hola! Soy tu asistente veterinario IA. Puedo ayudarte con preguntas sobre la salud de tus mascotas. ¿En qué puedo ayudarte hoy?',
      timestamp: new Date().toISOString(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiStatus, setAiStatus] = useState<'active' | 'offline'>('active');
  const flatListRef = React.useRef<FlatList>(null);

  useEffect(() => {
    checkAIStatus();
  }, []);

  useEffect(() => {
    // Scroll al último mensaje
    if (flatListRef.current && messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const checkAIStatus = async () => {
    try {
      const response = await axiosClient.get('/api/chat/status');
      if (response.data && response.data.status === 'active') {
        setAiStatus('active');
      } else {
        setAiStatus('offline');
      }
    } catch (error) {
      setAiStatus('offline');
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      text: inputText,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    Keyboard.dismiss();
    setLoading(true);

    try {
      const response = await axiosClient.post('/api/chat/consult', {
        message: inputText.trim(),
      });

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        text: response.data.response || 'No pude procesar tu pregunta. Intenta nuevamente.',
        timestamp: response.data.timestamp || new Date().toISOString(),
      };

      setMessages((prev) => [...prev, aiMessage]);

      // Actualizar estado si la IA estaba offline
      if (aiStatus === 'offline' && response.data.source === 'AI') {
        setAiStatus('active');
      }
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        text: aiStatus === 'offline'
          ? 'El servicio de IA está temporalmente no disponible. Por favor, intenta más tarde.'
          : 'Disculpa, hubo un error procesando tu pregunta. Intenta nuevamente.',
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isUser = item.type === 'user';
    const time = new Date(item.timestamp).toLocaleTimeString('es-CO', {
      hour: '2-digit',
      minute: '2-digit',
    });

    return (
      <View style={[styles.messageContainer, isUser && styles.userMessageContainer]}>
        <View
          style={[
            styles.messageBubble,
            isUser ? styles.userBubble : styles.aiBubble,
          ]}
        >
          <Text style={[styles.messageText, isUser && styles.userMessageText]}>
            {item.text}
          </Text>
          <Text style={[styles.timeText, isUser && styles.userTimeText]}>
            {time}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={100}
    >
      <View style={styles.headerContainer}>
        <View style={styles.headerContent}>
          <Text style={[typography.h2, { color: colors.darkGray, marginBottom: 4 }]}>
            🤖 Asistente Veterinario IA
          </Text>
          <View style={styles.statusRow}>
            <View
              style={[
                styles.statusDot,
                { backgroundColor: aiStatus === 'active' ? colors.success : colors.danger },
              ]}
            />
            <Text style={[typography.caption, { color: colors.muted }]}>
              {aiStatus === 'active' ? 'En línea' : 'Fuera de línea'}
            </Text>
          </View>
        </View>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.chatContent}
        scrollEnabled={true}
        onEndReachedThreshold={0.1}
        scrollIndicatorInsets={{ right: 1 }}
      />

      <View style={styles.inputContainer}>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Escribe tu pregunta..."
            placeholderTextColor={colors.muted}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
            editable={aiStatus === 'active' && !loading}
          />
          <TouchableOpacity
            onPress={handleSendMessage}
            disabled={!inputText.trim() || loading || aiStatus === 'offline'}
            style={[
              styles.sendButton,
              (!inputText.trim() || loading || aiStatus === 'offline') && styles.sendButtonDisabled,
            ]}
          >
            {loading ? (
              <ActivityIndicator size="small" color={colors.white} />
            ) : (
              <Text style={styles.sendButtonText}>📤</Text>
            )}
          </TouchableOpacity>
        </View>
        <Text style={[typography.caption, { color: colors.muted, marginTop: 8, textAlign: 'center' }]}>
          {aiStatus === 'offline'
            ? '⚠️ Servicio no disponible. Intenta más tarde.'
            : '💡 Puedes preguntarme sobre síntomas, cuidados o comportamiento de mascotas'}
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  headerContent: {
    flex: 1,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  chatContent: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  messageContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginVertical: 6,
  },
  userMessageContainer: {
    justifyContent: 'flex-end',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  aiBubble: {
    backgroundColor: colors.lightGray,
    marginLeft: 8,
    borderBottomLeftRadius: 4,
  },
  userBubble: {
    backgroundColor: colors.primary,
    marginRight: 8,
    borderBottomRightRadius: 4,
  },
  messageText: {
    fontSize: 14,
    color: colors.darkGray,
    lineHeight: 20,
  },
  userMessageText: {
    color: colors.white,
  },
  timeText: {
    fontSize: 11,
    color: colors.muted,
    marginTop: 4,
  },
  userTimeText: {
    color: colors.white,
    opacity: 0.8,
  },
  inputContainer: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    backgroundColor: colors.lightGray,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 14,
    color: colors.darkGray,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: colors.muted,
    opacity: 0.5,
  },
  sendButtonText: {
    fontSize: 20,
  },
});
