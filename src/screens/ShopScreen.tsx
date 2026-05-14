import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGameStore } from '../store/useGameStore';
import { SHOP_ITEMS, ShopItem } from '../constants/plants';
import { ShoppingCart, Coins } from 'lucide-react-native';

export const ShopScreen: React.FC = () => {
  const money = useGameStore((state) => state.money);
  const buySeed = useGameStore((state) => state.buySeed);

  const handleBuy = (item: ShopItem) => {
    if (money >= item.price) {
      buySeed(item.id);
      Alert.alert("Purchased!", `You bought 1 ${item.name} seed.`);
    } else {
      Alert.alert("Not enough coins", "Sell some harvests in your inventory to get more coins.");
    }
  };

  const renderItem = ({ item }: { item: ShopItem }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <View style={styles.priceTag}>
          <Coins color="#ffd54f" size={16} />
          <Text style={styles.priceText}>{item.price}</Text>
        </View>
      </View>
      <Text style={styles.speciesText}>{item.species} - {item.variety}</Text>
      <Text style={styles.descText}>{item.description}</Text>
      
      <TouchableOpacity 
        style={[styles.buyButton, money < item.price && styles.buyButtonDisabled]} 
        onPress={() => handleBuy(item)}
        disabled={money < item.price}
      >
        <ShoppingCart color="#fff" size={18} />
        <Text style={styles.buyButtonText}>Buy Seed</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Seed Shop</Text>
        <View style={styles.moneyContainer}>
          <Coins color="#ffd54f" size={24} />
          <Text style={styles.money}>{money}</Text>
        </View>
      </View>

      <FlatList
        data={SHOP_ITEMS}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a2e1a' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 20, backgroundColor: '#112211', borderBottomWidth: 1, borderBottomColor: '#2c3e2c',
  },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  moneyContainer: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  money: { fontSize: 20, fontWeight: 'bold', color: '#ffd54f' },
  listContent: { padding: 15 },
  card: {
    backgroundColor: '#2c3e2c', padding: 15, borderRadius: 10, marginBottom: 15,
    borderWidth: 1, borderColor: '#4a6b4a',
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 },
  cardTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  priceTag: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#112211', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 15, gap: 5 },
  priceText: { color: '#ffd54f', fontWeight: 'bold', fontSize: 16 },
  speciesText: { color: '#81c784', fontSize: 14, marginBottom: 8, fontWeight: 'bold' },
  descText: { color: '#a5d6a7', fontSize: 14, marginBottom: 15, fontStyle: 'italic' },
  buyButton: {
    flexDirection: 'row', backgroundColor: '#388e3c', padding: 12, borderRadius: 8,
    alignItems: 'center', justifyContent: 'center', gap: 8
  },
  buyButtonDisabled: { backgroundColor: '#5d4037' },
  buyButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});
