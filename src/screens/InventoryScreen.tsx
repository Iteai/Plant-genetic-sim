import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGameStore } from '../store/useGameStore';
import { Coins, Leaf, Beaker } from 'lucide-react-native';
import { Theme } from '../theme/colors';
import { SeedPacketSvg } from '../components/svg/SeedPacketSvg';
import { GlassPanel } from '../components/ui/GlassPanel';

export const InventoryScreen: React.FC = () => {
  const [tab, setTab] = useState<'seeds' | 'harvests'>('seeds');
  const seeds = useGameStore((state) => state.seeds);
  const inventory = useGameStore((state) => state.inventory);
  const money = useGameStore((state) => state.money);
  const sellHarvest = useGameStore((state) => state.sellHarvest);

  const renderSeed = ({ item }: { item: any }) => (
    <GlassPanel style={styles.card}>
      <View style={styles.cardTop}>
        <SeedPacketSvg species={item.species} rarity={item.rarity} width={50} height={70} />
        <View style={styles.cardInfo}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardTitle}>{item.name}</Text>
            <View style={styles.qtyBadge}>
              <Text style={styles.qtyText}>x{item.quantity}</Text>
            </View>
          </View>
          <Text style={[styles.rarityText, { color: Theme.rarity[item.rarity] }]}>
            {item.rarity} {item.variety}
          </Text>
          <View style={styles.statsRow}>
            <Text style={styles.statText}>Gen: <Text style={styles.statHighlight}>{item.genetics.generation}</Text></Text>
            <Text style={styles.statText}>Mutations: <Text style={styles.statHighlight}>{item.genetics.mutationCount}</Text></Text>
          </View>
        </View>
      </View>
      
      {/* Genetics Breakdown */}
      <View style={styles.genesContainer}>
        <View style={styles.geneBox}><Text style={styles.geneLabel}>Color</Text><Text style={styles.geneValue}>{item.genetics.color.allele1}{item.genetics.color.allele2}</Text></View>
        <View style={styles.geneBox}><Text style={styles.geneLabel}>Size</Text><Text style={styles.geneValue}>{item.genetics.size.allele1}{item.genetics.size.allele2}</Text></View>
        <View style={styles.geneBox}><Text style={styles.geneLabel}>Growth</Text><Text style={styles.geneValue}>{item.genetics.growthRate.allele1}{item.genetics.growthRate.allele2}</Text></View>
        <View style={styles.geneBox}><Text style={styles.geneLabel}>Yield</Text><Text style={styles.geneValue}>{item.genetics.yield.allele1}{item.genetics.yield.allele2}</Text></View>
      </View>
    </GlassPanel>
  );

  const renderHarvest = ({ item }: { item: any }) => (
    <GlassPanel style={styles.card}>
      <View style={styles.cardHeaderRow}>
        <Text style={styles.cardTitle}>{item.variety} Harvest</Text>
        <View style={styles.qtyBadge}>
          <Text style={styles.qtyText}>x{item.quantity}</Text>
        </View>
      </View>
      <Text style={[styles.rarityText, { color: Theme.rarity[item.rarity] }]}>{item.rarity} Quality</Text>
      
      <View style={styles.harvestBottom}>
        <Text style={styles.qualityText}>Health: {Math.round(item.quality)}%</Text>
        <TouchableOpacity style={styles.sellButton} onPress={() => sellHarvest(item.id)}>
          <Coins color="#fff" size={16} />
          <Text style={styles.sellButtonText}>Sell ({item.value})</Text>
        </TouchableOpacity>
      </View>
    </GlassPanel>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Storage Archive</Text>
        <View style={styles.moneyContainer}>
          <Coins color={Theme.secondary} size={24} />
          <Text style={styles.money}>{money}</Text>
        </View>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity style={[styles.tab, tab === 'seeds' && styles.activeTab]} onPress={() => setTab('seeds')}>
          <Beaker color={tab === 'seeds' ? '#18FFFF' : Theme.textMuted} size={20} />
          <Text style={[styles.tabText, tab === 'seeds' && styles.activeTabText]}>Genetic Seeds</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, tab === 'harvests' && styles.activeTab]} onPress={() => setTab('harvests')}>
          <Leaf color={tab === 'harvests' ? '#00E676' : Theme.textMuted} size={20} />
          <Text style={[styles.tabText, tab === 'harvests' && styles.activeTabText]}>Organic Harvests</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={tab === 'seeds' ? seeds : inventory}
        keyExtractor={(item) => item.id}
        renderItem={tab === 'seeds' ? renderSeed : renderHarvest}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<Text style={styles.emptyText}>Archive is empty.</Text>}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050B08' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, backgroundColor: 'rgba(21, 41, 30, 0.8)', borderBottomWidth: 1, borderBottomColor: 'rgba(24, 255, 255, 0.2)' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#E0F7FA' },
  moneyContainer: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  money: { fontSize: 20, fontWeight: 'bold', color: Theme.secondary },
  tabs: { flexDirection: 'row', padding: 16, gap: 12 },
  tab: { flex: 1, flexDirection: 'row', padding: 12, alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: 'rgba(24, 255, 255, 0.05)', borderRadius: 12, borderWidth: 1, borderColor: 'transparent' },
  activeTab: { backgroundColor: 'rgba(24, 255, 255, 0.15)', borderColor: 'rgba(24, 255, 255, 0.5)' },
  tabText: { color: Theme.textMuted, fontWeight: 'bold', fontSize: 14 },
  activeTabText: { color: '#18FFFF' },
  listContent: { padding: 16, paddingBottom: 40 },
  card: { marginBottom: 16 },
  cardTop: { flexDirection: 'row', gap: 16 },
  cardInfo: { flex: 1, justifyContent: 'center' },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  cardTitle: { color: '#E0F7FA', fontSize: 18, fontWeight: 'bold' },
  qtyBadge: { backgroundColor: 'rgba(0, 230, 118, 0.2)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, borderWidth: 1, borderColor: '#00E676' },
  qtyText: { color: '#00E676', fontWeight: 'bold', fontSize: 12 },
  rarityText: { fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 8 },
  statsRow: { flexDirection: 'row', gap: 12 },
  statText: { color: Theme.textMuted, fontSize: 12 },
  statHighlight: { color: '#18FFFF', fontWeight: 'bold' },
  genesContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: 'rgba(24, 255, 255, 0.1)' },
  geneBox: { alignItems: 'center' },
  geneLabel: { color: Theme.textMuted, fontSize: 10, textTransform: 'uppercase', marginBottom: 4 },
  geneValue: { color: '#18FFFF', fontSize: 16, fontWeight: 'bold', letterSpacing: 2 },
  harvestBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 },
  qualityText: { color: '#00E676', fontSize: 14, fontWeight: 'bold' },
  sellButton: { flexDirection: 'row', backgroundColor: '#FF8F00', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8, alignItems: 'center', gap: 8 },
  sellButtonText: { color: '#fff', fontWeight: 'bold' },
  emptyText: { color: Theme.textMuted, textAlign: 'center', marginTop: 40, fontSize: 16 }
});
