import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGameStore } from '../store/useGameStore';
import { SHOP_ITEMS, ShopItem } from '../constants/plants';
import { ShoppingCart, Coins } from 'lucide-react-native';
import { Theme } from '../theme/colors';
import { SeedPacketSvg } from '../components/svg/SeedPacketSvg';

export const ShopScreen: React.FC = () => {
  const money = useGameStore((state) => state.money);
  const buySeed = useGameStore((state) => state.buySeed);

  const handleBuy = (item: ShopItem) => {
    if (money >= item.price) {
      buySeed(item.id);
    } else {
      Alert.alert("Not enough coins", "Sell harvests in your inventory to earn more coins.");
    }
  };

  const renderItem = ({ item }: { item: ShopItem }) => (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <SeedPacketSvg species={item.species} rarity={item.rarity} width={50} height={70} />
        <View style={styles.cardInfo}>
          <Text style={styles.cardTitle}>{item.name}</Text>
          <Text style={[styles.rarityText, { color: Theme.rarity[item.rarity] }]}>
            {item.rarity} {item.species}
          </Text>
          <Text style={styles.descText} numberOfLines={2}>{item.description}</Text>
        </View>
      </View>
      
      <View style={styles.cardBottom}>
        <View style={styles.priceTag}>
          <Coins color={Theme.secondary} size={16} />
          <Text style={styles.priceText}>{item.price}</Text>
        </View>
        <TouchableOpacity 
          style={[styles.buyButton, money < item.price && styles.buyButtonDisabled]} 
          onPress={() => handleBuy(item)}
          disabled={money < item.price}
        >
          <ShoppingCart color="#fff" size={16} />
          <Text style={styles.buyButtonText}>Buy</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Seed Shop</Text>
        <View style={styles.moneyContainer}>
          <Coins color={Theme.secondary} size={24} />
          <Text style={styles.money}>{money}</Text>
        </View>
      </View>

      <FlatList
        data={SHOP_ITEMS}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.background },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 20, backgroundColor: Theme.surface, borderBottomWidth: 1, borderBottomColor: Theme.surfaceLight,
  },
  title: { fontSize: 24, fontWeight: 'bold', color: Theme.text },
  moneyContainer: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  money: { fontSize: 20, fontWeight: 'bold', color: Theme.secondary },
  listContent: { padding: 16 },
  card: {
    backgroundColor: Theme.surface, padding: 16, borderRadius: 16, marginBottom: 16,
    borderWidth: 1, borderColor: Theme.surfaceLight,
  },
  cardTop: { flexDirection: 'row', gap: 16, marginBottom: 16 },
  cardInfo: { flex: 1, justifyContent: 'center' },
  cardTitle: { color: Theme.text, fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  rarityText: { fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 6 },
  descText: { color: Theme.textMuted, fontSize: 13, lineHeight: 18 },
  cardBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: Theme.surfaceLight, paddingTop: 12 },
  priceTag: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  priceText: { color: Theme.secondary, fontWeight: 'bold', fontSize: 18 },
  buyButton: {
    flexDirection: 'row', backgroundColor: Theme.primaryDark, paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8,
    alignItems: 'center', gap: 8
  },
  buyButtonDisabled: { backgroundColor: Theme.surfaceLight },
  buyButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 14 }
});
