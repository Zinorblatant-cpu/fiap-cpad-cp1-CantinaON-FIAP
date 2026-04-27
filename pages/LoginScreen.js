import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ActionButton from '../components/ActionButton';
import AuthScreenLayout from '../components/AuthScreenLayout';
import FormInput from '../components/FormInput';
import { DEFAULT_MOCK_USER, useAppContext } from '../context/AppContext';

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

export default function LoginScreen({ navigation }) {
  const { loginUser } = useAppContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [authError, setAuthError] = useState('');

  const validateFields = () => {
    const nextErrors = {};

    if (!email.trim()) {
      nextErrors.email = 'Informe o e-mail.';
    } else if (!isValidEmail(email)) {
      nextErrors.email = 'Informe um e-mail valido.';
    }

    if (!password) {
      nextErrors.password = 'Informe a senha.';
    }

    return nextErrors;
  };

  const handleLogin = async () => {
    const nextErrors = validateFields();
    setErrors(nextErrors);
    setAuthError('');

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    const result = await loginUser({ email, password });

    if (!result.success) {
      setAuthError('E-mail ou senha incorretos.');
      return;
    }

    navigation.navigate('Menu');
  };

  return (
    <AuthScreenLayout title="LOGIN" subtitle="Entre para continuar o seu pedido">
      <View style={styles.badge}>
        <Text style={styles.badgeText}>Sessao em memoria</Text>
      </View>

      <View style={styles.mockCard}>
        <Text style={styles.mockTitle}>Acesso mock padrao</Text>
        <Text style={styles.mockLine}>E-mail: {DEFAULT_MOCK_USER.email}</Text>
        <Text style={styles.mockLine}>Senha: {DEFAULT_MOCK_USER.password}</Text>
      </View>

      <FormInput
        label="E-mail"
        value={email}
        onChangeText={setEmail}
        placeholder="E-mail"
        autoCapitalize="none"
        keyboardType="email-address"
        error={errors.email}
      />

      <FormInput
        label="Senha"
        value={password}
        onChangeText={setPassword}
        placeholder="Senha"
        secureTextEntry
        error={errors.password}
      />

      {authError ? <Text style={styles.authError}>{authError}</Text> : null}

      <ActionButton label="ENTRAR" onPress={handleLogin} />

      <View style={styles.secondaryAction}>
        <ActionButton
          label="CRIAR CADASTRO"
          onPress={() => navigation.navigate('Register')}
          variant="secondary"
        />
      </View>
    </AuthScreenLayout>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'center',
    backgroundColor: '#260608',
    borderWidth: 1,
    borderColor: '#5A1117',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 18,
  },
  badgeText: {
    color: '#FFB8BE',
    fontSize: 12,
    fontWeight: '600',
  },
  mockCard: {
    backgroundColor: '#120B0C',
    borderWidth: 1,
    borderColor: '#2F1417',
    borderRadius: 16,
    padding: 14,
    marginBottom: 18,
  },
  mockTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 6,
  },
  mockLine: {
    color: '#FFB8BE',
    fontSize: 13,
    marginBottom: 2,
  },
  authError: {
    color: '#FF8D8D',
    fontSize: 13,
    marginBottom: 12,
    textAlign: 'center',
  },
  secondaryAction: {
    marginTop: 12,
  },
});
