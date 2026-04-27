import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ActionButton from '../components/ActionButton';
import AuthScreenLayout from '../components/AuthScreenLayout';
import FormInput from '../components/FormInput';
import { useAppContext } from '../context/AppContext';

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

export default function RegisterScreen({ navigation }) {
  const { registerUser } = useAppContext();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [errors, setErrors] = useState({});
  const [registerError, setRegisterError] = useState('');

  const validateFields = () => {
    const nextErrors = {};

    if (!fullName.trim()) {
      nextErrors.fullName = 'Informe o nome completo.';
    }

    if (!email.trim()) {
      nextErrors.email = 'Informe o e-mail.';
    } else if (!isValidEmail(email)) {
      nextErrors.email = 'Informe um e-mail valido.';
    }

    if (!password) {
      nextErrors.password = 'Informe a senha.';
    } else if (password.length < 6) {
      nextErrors.password = 'A senha deve ter no minimo 6 caracteres.';
    }

    if (!passwordConfirmation) {
      nextErrors.passwordConfirmation = 'Confirme a senha.';
    } else if (password !== passwordConfirmation) {
      nextErrors.passwordConfirmation = 'A confirmacao deve ser identica a senha.';
    }

    return nextErrors;
  };

  const handleRegister = async () => {
    const nextErrors = validateFields();
    setErrors(nextErrors);
    setRegisterError('');

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    const result = await registerUser({
      fullName,
      email,
      password,
    });

    if (!result.success) {
      setRegisterError('Ja existe uma conta com esse e-mail.');
      return;
    }

    navigation.navigate('Login');
  };

  return (
    <AuthScreenLayout
      title="CADASTRO"
      subtitle="Crie sua conta para usar o login somente durante esta execucao"
    >
      <View style={styles.badge}>
        <Text style={styles.badgeText}>Cadastro em memoria</Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoText}>
          O cadastro fica disponivel apenas enquanto o app estiver aberto.
        </Text>
      </View>

      <FormInput
        label="Nome completo"
        value={fullName}
        onChangeText={setFullName}
        placeholder="Nome completo"
        error={errors.fullName}
      />

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

      <FormInput
        label="Confirmacao de senha"
        value={passwordConfirmation}
        onChangeText={setPasswordConfirmation}
        placeholder="Confirmacao de senha"
        secureTextEntry
        error={errors.passwordConfirmation}
      />

      {registerError ? (
        <Text style={styles.registerError}>{registerError}</Text>
      ) : null}

      <ActionButton label="CRIAR CONTA" onPress={handleRegister} />

      <View style={styles.secondaryAction}>
        <ActionButton
          label="JA TENHO CONTA"
          onPress={() => navigation.navigate('Login')}
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
  infoCard: {
    backgroundColor: '#120B0C',
    borderWidth: 1,
    borderColor: '#2F1417',
    borderRadius: 16,
    padding: 14,
    marginBottom: 18,
  },
  infoText: {
    color: '#FFB8BE',
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
  },
  registerError: {
    color: '#FF8D8D',
    fontSize: 13,
    marginBottom: 12,
    textAlign: 'center',
  },
  secondaryAction: {
    marginTop: 12,
  },
});
