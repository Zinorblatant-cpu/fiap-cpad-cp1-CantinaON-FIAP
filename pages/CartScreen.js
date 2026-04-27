import { StatusBar } from 'expo-status-bar';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import ActionButton from '../components/ActionButton';
import ScreenHeader from '../components/ScreenHeader';
import { useAppContext } from '../context/AppContext';

function groupCartItems(cartItems) {
  return cartItems.reduce((accumulator, item) => {
    const existingItem = accumulator.find((currentItem) => currentItem.id === item.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      accumulator.push({ ...item, quantity: 1 });
    }

    return accumulator;
  }, []);
}

export default function CartScreen({ navigation }) {
  const { cartItems, clearCart, completeOrder, currentUser, removeItemFromCart } =
    useAppContext();

  const groupedItems = groupCartItems(cartItems);
  const total = groupedItems.reduce((accumulator, item) => {
    const price = parseFloat(item.price.replace('R$', '').replace(',', '.'));
    return accumulator + price * item.quantity;
  }, 0);
  const isCartEmpty = groupedItems.length === 0;

  const handleCheckout = async () => {
    const result = await completeOrder();

    if (result.success) {
      navigation.navigate('PickupCode');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <ScreenHeader
        title="SEU CARRINHO"
        subtitle={currentUser ? `Pedido de ${currentUser.fullName}` : 'Revise o pedido'}
      />

      <ScrollView contentContainerStyle={styles.content}>
        {!isCartEmpty ? (
          <>
            {groupedItems.map((item) => (
              <View key={item.id} style={styles.cartItem}>
                <Image source={item.image} style={styles.itemImage} />
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemPrice}>{item.price}</Text>
                  <Text style={styles.itemQuantity}>x{item.quantity}</Text>
                </View>
                <View style={styles.itemAction}>
                  <ActionButton
                    label={`Remover ${item.name}`}
                    onPress={() => removeItemFromCart(item.id)}
                    variant="secondary"
                  />
                </View>
              </View>
            ))}

            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Resumo</Text>
              <Text style={styles.summaryTotal}>Total R$ {total.toFixed(2).replace('.', ',')}</Text>
              <Text style={styles.summaryHelper}>
                O codigo de retirada sera gerado ao concluir o pagamento.
              </Text>
            </View>
          </>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Carrinho vazio</Text>
            <Text style={styles.emptyText}>
              Adicione produtos no cardapio para continuar o pedido.
            </Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.footerSecondary}>
          <ActionButton
            label="LIMPAR CARRINHO"
            onPress={clearCart}
            variant="secondary"
            disabled={isCartEmpty}
          />
        </View>
        <ActionButton
          label={`PAGAR R$ ${total.toFixed(2).replace('.', ',')}`}
          onPress={isCartEmpty ? undefined : handleCheckout}
          disabled={isCartEmpty}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000000',
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 24,
  },
  cartItem: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#2B2B2B',
  },
  itemImage: {
    width: '100%',
    height: 160,
    borderRadius: 12,
    marginBottom: 12,
  },
  itemInfo: {
    marginBottom: 12,
  },
  itemName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    textTransform: 'capitalize',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#E3000B',
  },
  itemQuantity: {
    color: '#B8B8B8',
    marginTop: 4,
  },
  itemAction: {
    marginTop: 4,
  },
  summaryCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#2B2B2B',
    marginTop: 4,
  },
  summaryLabel: {
    color: '#B8B8B8',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
  },
  summaryTotal: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  summaryHelper: {
    color: '#B8B8B8',
    lineHeight: 20,
  },
  emptyState: {
    backgroundColor: '#1A1A1A',
    borderRadius: 18,
    padding: 24,
    borderWidth: 1,
    borderColor: '#2B2B2B',
    alignItems: 'center',
  },
  emptyTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptyText: {
    color: '#B8B8B8',
    textAlign: 'center',
    lineHeight: 20,
  },
  footer: {
    padding: 16,
    backgroundColor: '#000000',
    borderTopWidth: 1,
    borderTopColor: '#2B2B2B',
  },
  footerSecondary: {
    marginBottom: 10,
  },
});
