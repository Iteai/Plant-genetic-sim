import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useGameStore } from '../store/useGameStore';
import { Coins, Leaf, Beaker } from 'lucide-react-native';
import { Theme } from '../theme/colors';
import { SeedPacketSvg } from '../components/svg/SeedPacketSvg';

export const InventoryScreen: React.FC = () => {
  const [tab, setTab] = useState<'seeds' | 'harvests'>('seeds');
  const seeds = useGameStore((state) => state.seeds);
  const inventory = useGameStore((state) => state.inventory);
  const money = useGameStore((state) => state.money);
  const sellHarvest = useGameStore((state) => state.sellHarvest);

  const renderSeed = ({ item }: { item: any }) => (
    <View style={styles.cardWrapper}>
      <View style={styles.packetContainer}>
        <SeedPacketSvg species={item.species} rarity={item.rarity} width={70} height={98} />
      </View>

      <View style={styles.card}>
        <View style={styles.cardContent}>
          <View style={styles.headerRow}>
            <Text style={styles.cardTitle}>{item.name}</Text>
            <View style={styles.qtyBadge}>
              <Text style={styles.qtyText}>x{item.quantity}</Text>
            </View>
          </View>
          
          <Text style={[styles.rarityText, { color: Theme.rarity[item.rarity] }]}>
            {item.rarity} Strain • Gen {item.genetics.generation}
          </Text>

          {/* High-Tech Genetics Grid */}
          <View style={styles.genesGrid}>
            <View style={styles.geneBox}>
              <Text style={styles.geneLabel}>CLR</Text>
              <Text style={styles.geneValue}>{item.genetics.color.allele1}{item.genetics.color.allele2}</Text>
            </View>
            <View style={styles.geneBox}>
              <Text style={styles.geneLabel}>SIZ</Text>
              <Text style={styles.geneValue}>{item.genetics.size.allele1}{item.genetics.size.allele2}</Text>
            </View>
            <View style={styles.geneBox}>
              <Text style={styles.geneLabel}>GRO</Text>
              <Text style={styles.geneValue}>{item.genetics.growthRate.allele1}{item.genetics.growthRate.allele2}</Text>
            </View>
            <View style={styles.geneBox}>
              <Text style={styles.geneLabel}>YLD</Text>
              <Text style={styles.geneValue}>{item.genetics.yield.allele1}{item.genetics.yield.allele2}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );

  const renderHarvest = ({ item }: { item: any }) => (
    <View style={styles.harvestCard}>
      <View style={styles.harvestHeader}>
        <View>
          <Text style={styles.cardTitle}>{item.variety} Harvest</Text>
          <Text style={[styles.rarityText, { color: Theme.rarity[item.rarity] }]}>
            {item.rarity} Quality • {Math.round(item.quality)}% Health
          </Text>
        </View>
        <View style={styles.qtyBadge}>
          <Text style={styles.qtyText}>x{item.quantity}</Text>
        </View>
      </View>
      
      <View style={styles.harvestBottom}>
        <View style={styles.priceTag}>
          <Coins color={Theme.secondary} size={18} />
          <Text style={styles.priceText}>+{item.value}</Text>
        </View>
        
        <TouchableOpacity style={styles.sellButtonWrapper} onPress={() => sellHarvest(item.id)} activeOpacity={0.8}>
          <LinearGradient
            colors={['#FFB300', '#FF8F00']}
            style={styles.sellButton}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Coins color="#FFF" size={16} />
            <Text style={styles.sellButtonText}>Sell</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
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
          <Beaker color={tab === 'seeds' ? '#18FFFF' : 'rgba(255,255,255,0.4)'} size={20} />
          <Text style={[styles.tabText, tab === 'seeds' && styles.activeTabText]}>Genetic Seeds</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, tab === 'harvests' && styles.activeTab]} onPress={() => setTab('harvests')}>
          <Leaf color={tab === 'harvests' ? '#00E676' : 'rgba(255,255,255,0.4)'} size={20} />
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
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, backgroundColor: '#0A140F', borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)', zIndex: 10 },
  title: { fontSize: 24, fontWeight: '900', color: '#FFFFFF', letterSpacing: 0.5 },
  moneyContainer: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: 'rgba(255, 213, 79, 0.1)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255, 213, 79, 0.3)' },
  money: { fontSize: 18, fontWeight: 'bold', color: Theme.secondary },
  tabs: { flexDirection: 'row', padding: 16, gap: 12 },
  tab: { flex: 1, flexDirection: 'row', padding: 12, alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#111D16', borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  activeTab: { backgroundColor: 'rgba(24, 255, 255, 0.1)', borderColor: 'rgba(24, 255, 255, 0.3)' },
  tabText: { color: 'rgba(255,255,255,0.4)', fontWeight: 'bold', fontSize: 14 },
  activeTabText: { color: '#18FFFF' },
  listContent: { padding: 16, paddingBottom: 40 },
  cardWrapper: { position: 'relative', marginBottom: 20, paddingLeft: 20 },
  packetContainer: { position: 'absolute', left: 0, top: -10, zIndex: 2, shadowColor: '#000', shadowOffset: { width: -4, height: 8 }, shadowOpacity: 0.5, shadowRadius: 8, elevation: 8 },
  card: { backgroundColor: '#111D16', borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', marginLeft: 30, minHeight: 110, shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  cardContent: { padding: 16, paddingLeft: 50 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 },
  cardTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: '800', flex: 1 },
  qtyBadge: { backgroundColor: 'rgba(0, 230, 118, 0.15)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(0, 230, 118, 0.4)' },
  qtyText: { color: '#00E676', fontWeight: '900', fontSize: 12 },
  rarityText: { fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 },
  genesGrid: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: 'rgba(0,0,0,0.3)', padding: 10, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  geneBox: { alignItems: 'center' },
  geneLabel: { color: 'rgba(255,255,255,0.4)', fontSize: 9, fontWeight: 'bold', letterSpacing: 1, marginBottom: 2 },
  geneValue: { color: '#18FFFF', fontSize: 14, fontWeight: '900', letterSpacing: 1 },
  harvestCard: { backgroundColor: '#111D16', borderRadius: 20, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  harvestHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  harvestBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)', paddingTop: 12 },
  priceTag: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  priceText: { color: Theme.secondary, fontWeight: '900', fontSize: 18 },
  sellButtonWrapper: { borderRadius: 12, overflow: 'hidden', shadowColor: '#FF8F00', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 6, elevation: 4 },
  sellButton: { flexDirection: 'row', paddingVertical: 8, paddingHorizontal: 20, alignItems: 'center', gap: 8 },
  sellButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 14, textTransform: 'uppercase', letterSpacing: 0.5 },
  emptyText: { color: 'rgba(255,255,255,0.4)', textAlign: 'center', marginTop: 40, fontSize: 16 }
});
