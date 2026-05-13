import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGameStore } from '../store/useGameStore';

export const InventoryScreen: React.FC = () => {
  const [tab, setTab] = useState<'seeds' | 'harvests'>('seeds');
  const seeds = useGameStore((state) => state.seeds);
  const inventory = useGameStore((state) => state.inventory);
  const money = useGameStore((state) => state.money);

  const renderSeed = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Text style={styles.cardQty}>x{item.quantity}</Text>
      </View>
      <Text style={styles.cardSub}>Species: {item.species}</Text>
      <Text style={styles.cardSub}>Generation: {item.genetics.generation}</Text>
      <Text style={styles.cardSub}>Mutations: {item.genetics.mutationCount}</Text>
      <View style={styles.genesContainer}>
        <Text style={styles.geneText}>Color: {item.genetics.color.allele1}{item.genetics.color.allele2}</Text>
        <Text style={styles.geneText}>Size: {item.genetics.size.allele1}{item.genetics.size.allele2}</Text>
        <Text style={styles.geneText}>Growth: {item.genetics.growthRate.allele1}{item.genetics.growthRate.allele2}</Text>
        <Text style={styles.geneText}>Yield: {item.genetics.yield.allele1}{item.genetics.yield.allele2}</Text>
      </View>
    </View>
  );

  const renderHarvest = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.species} Harvest</Text>
        <Text style={styles.cardQty}>x{item.quantity}</Text>
      </View>
      <Text style={styles.cardSub}>Quality: {Math.round(item.quality)}%</Text>
      <Text style={styles.cardSub}>Value: ${item.value}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Inventory</Text>
        <Text style={styles.money}>${money}</Text>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity 
          style={[styles.tab, tab === 'seeds' && styles.activeTab]} 
          onPress={() => setTab('seeds')}
        >
          <Text style={[styles.tabText, tab === 'seeds' && styles.activeTabText]}>Seeds</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, tab === 'harvests' && styles.activeTab]} 
          onPress={() => setTab('harvests')}
        >
          <Text style={[styles.tabText, tab === 'harvests' && styles.activeTabText]}>Harvests</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={tab === 'seeds' ? seeds : inventory}
        keyExtractor={(item) => item.id}
        renderItem={tab === 'seeds' ? renderSeed : renderHarvest}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No items found.</Text>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a2e1a' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#112211',
    borderBottomWidth: 1,
    borderBottomColor: '#2c3e2c',
  },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  money: { fontSize: 20, fontWeight: 'bold', color: '#ffd54f' },
  tabs: { flexDirection: 'row', padding: 10 },
  tab: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    backgroundColor: '#1b261b',
    borderRadius: 8,
    marginHorizontal: 5,
  },
  activeTab: { backgroundColor: '#388e3c' },
  tabText: { color: '#a5d6a7', fontWeight: 'bold' },
  activeTabText: { color: '#fff' },
  listContent: { padding: 15 },
  card: {
    backgroundColor: '#2c3e2c',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#4a6b4a',
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  cardTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  cardQty: { color: '#81c784', fontSize: 16, fontWeight: 'bold' },
  cardSub: { color: '#a5d6a7', fontSize: 14, marginBottom: 2 },
  genesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    backgroundColor: '#1b261b',
    padding: 8,
    borderRadius: 6,
  },
  geneText: { color: '#fff', width: '50%', fontSize: 12, marginBottom: 4 },
  emptyText: { color: '#a5d6a7', textAlign: 'center', marginTop: 40, fontSize: 16 }
});
