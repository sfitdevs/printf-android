import React, { useContext, useState, useEffect, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Dimensions,
  Platform,
  Image,
} from 'react-native';
import { AppwriteContext } from '../appwrite/AppWriteContext';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../routes/AppStack';
import Card from '../components/Card';
import StatusBadge from '../components/StatusBadge';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { SPACING, FONT_SIZE, FONT_WEIGHT, RADIUS, SHADOWS, COLORS } from '../components/StyleGuide';

type OrderType = {
  id: string;
  name: string;
  status: string;
  cost: number;
  color: string;
  copies: number;
  portrait: boolean;
};

const { width } = Dimensions.get('window');

const Home = () => {
  const { appwrite, theme, colors } = useContext(AppwriteContext);
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('All');
  const [orders, setOrders] = useState<OrderType[]>([
    {
      id: '1',
      name: 'Wedding Photos',
      status: 'In Progress',
      cost: 35.99,
      color: 'Full Color',
      copies: 12,
      portrait: true,
    },
    {
      id: '2',
      name: 'Resume Document',
      status: 'Completed',
      cost: 12.5,
      color: 'Black & White',
      copies: 5,
      portrait: false,
    },
    {
      id: '3',
      name: 'Family Portrait',
      status: 'Pending',
      cost: 25.99,
      color: 'Full Color',
      copies: 1,
      portrait: true,
    },
    {
      id: '4',
      name: 'Business Cards',
      status: 'Completed',
      cost: 18.75,
      color: 'Full Color',
      copies: 50,
      portrait: true,
    },
    {
      id: '5',
      name: 'Conference Poster',
      status: 'Pending',
      cost: 42.99,
      color: 'Full Color',
      copies: 1,
      portrait: false,
    },
  ]);

  const isDarkTheme = theme === 'dark';

  const navigateToSettings = () => {
    navigation.navigate('Settings');
  };

  const navigateToNewOrder = () => {
    navigation.navigate('NewOrder');
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return COLORS.success;
      case 'pending':
        return COLORS.warning;
      case 'in progress':
        return COLORS.info;
      default:
        return COLORS.primary.default;
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return `${COLORS.success}15`;
      case 'pending':
        return `${COLORS.warning}15`;
      case 'in progress':
        return `${COLORS.info}15`;
      default:
        return `${COLORS.primary.default}15`;
    }
  };

  const filteredOrders = useMemo(() => {
    if (!searchQuery && activeTab === 'All') {
      return orders;
    }

    return orders.filter((order) => {
      const matchesSearch = !searchQuery ||
        order.name.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTab = activeTab === 'All' ||
        order.status.toLowerCase() === activeTab.toLowerCase();

      return matchesSearch && matchesTab;
    });
  }, [orders, searchQuery, activeTab]);

  const renderOrderItem = ({ item }: { item: OrderType }) => {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('OrderDetails', { order: item })}
        activeOpacity={0.7}
        style={[styles.orderCard, { backgroundColor: colors.card, borderColor: `${colors.border}40` }]}
      >
        {/* Order Card Header */}
        <View style={styles.orderHeader}>
          <View style={styles.orderNameContainer}>
            <View style={[styles.orderIconContainer, { backgroundColor: `${getStatusColor(item.status)}15` }]}>
              <MaterialCommunityIcons
                name={
                  item.status.toLowerCase() === 'completed' ? 'check-circle-outline' :
                    item.status.toLowerCase() === 'in progress' ? 'clock-outline' :
                      'clock-alert-outline'
                }
                size={18}
                color={getStatusColor(item.status)}
              />
            </View>
            <View style={styles.orderTextContainer}>
              <Text style={[styles.orderName, { color: colors.text }]} numberOfLines={1} ellipsizeMode="tail">{item.name}</Text>
              <Text style={[styles.orderIdText, { color: colors.subtext }]}>Order #{item.id}</Text>
            </View>
          </View>
          <StatusBadge status={item.status} size="small" />
        </View>

        <View style={styles.orderDetailSection}>
          <View style={styles.orderDetailRow}>
            {/* Copies */}
            <View style={styles.specItem}>
              <MaterialCommunityIcons
                name="content-copy"
                size={16}
                color={colors.subtext}
                style={styles.specIcon}
              />
              <Text style={[styles.specValue, { color: colors.text }]}>
                {item.copies}
              </Text>
            </View>

            {/* Type */}
            <View style={styles.specItem}>
              <MaterialCommunityIcons
                name={item.color.includes('Color') ? 'palette' : 'tint-off'}
                size={16}
                color={colors.subtext}
                style={styles.specIcon}
              />
              <Text style={[styles.specValue, { color: colors.text }]}>
                {item.color === 'Full Color' ? 'Color' : 'B&W'}
              </Text>
            </View>

            {/* Orientation */}
            <View style={styles.specItem}>
              <MaterialCommunityIcons
                name={item.portrait ? 'phone-portrait' : 'phone-landscape'}
                size={16}
                color={colors.subtext}
                style={styles.specIcon}
              />
              <Text style={[styles.specValue, { color: colors.text }]}>
                {item.portrait ? 'Portrait' : 'Landscape'}
              </Text>
            </View>
          </View>

          {/* Cost */}
          <View style={styles.costRow}>
            <View style={[styles.costContainer, { backgroundColor: `${COLORS.primary.default}15` }]}>
              <Text style={[styles.orderCostText, { color: COLORS.primary.default }]}>
                ${item.cost.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // Calculate bottom padding to avoid overlapping with navigation bar
  const bottomPadding = Math.max(insets.bottom, 20);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={isDarkTheme ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />

      {/* Header Section */}
      <View style={[styles.header, { paddingTop: insets.top + SPACING.sm }]}>
        <View style={styles.headerContent}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>PrintF</Text>
          <TouchableOpacity
            style={[styles.profileButton, { backgroundColor: COLORS.primary.default }]}
            onPress={navigateToSettings}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons name="account" size={22} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={[styles.searchWrapper, { backgroundColor: `${colors.card}`, borderColor: colors.border }]}>
          <MaterialCommunityIcons name="magnify" size={20} color={colors.subtext} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search orders"
            placeholderTextColor={colors.subtext}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              style={[styles.clearButton, { backgroundColor: `${colors.border}30` }]}
              onPress={() => setSearchQuery('')}
            >
              <MaterialCommunityIcons name="close" size={16} color={colors.subtext} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Title and Subtitle */}
      <View style={styles.titleContainer}>
        <Text style={[styles.title, { color: colors.text }]}>My Orders</Text>
        <Text style={[styles.subtitle, { color: colors.subtext }]}>
          {searchQuery ? `Search results for "${searchQuery}"` : 'Manage your printing orders'}
        </Text>
      </View>

      {/* Order type tabs */}
      <View style={styles.tabsContainer}>
        <FlatList
          horizontal
          data={['All', 'Pending', 'In Progress', 'Completed']}
          renderItem={({ item }) => (
            <TouchableOpacity
              key={item}
              style={[
                styles.tab,
                activeTab === item && styles.activeTab,
                activeTab === item && { backgroundColor: `${COLORS.primary.default}15` }
              ]}
              onPress={() => setActiveTab(item)}
            >
              <Text
                style={[
                  styles.tabText,
                  { color: activeTab === item ? COLORS.primary.default : colors.subtext },
                  activeTab === item && styles.activeTabText
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContent}
        />
      </View>

      {/* Orders List */}
      <FlatList
        data={filteredOrders}
        keyExtractor={(item) => item.id}
        renderItem={renderOrderItem}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: 90 + bottomPadding }, // Add extra padding for navigation bar
          filteredOrders.length === 0 && styles.emptyListContent
        ]}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons
              name="clipboard-text-off-outline"
              size={60}
              color={colors.subtext}
              style={styles.emptyIcon}
            />
            <Text style={[styles.emptyText, { color: colors.subtext }]}>
              {searchQuery
                ? `No orders found matching "${searchQuery}"`
                : "No orders found"}
            </Text>
          </View>
        }
      />

      {/* Floating Add Button - adjusted to account for bottom insets */}
      <TouchableOpacity
        style={[
          styles.floatingAddButton,
          {
            backgroundColor: COLORS.primary.default,
            bottom: 20 + bottomPadding // Adjust position to avoid navigation bar
          }
        ]}
        onPress={navigateToNewOrder}
        activeOpacity={0.7}
      >
        <MaterialCommunityIcons name="plus" size={28} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: FONT_WEIGHT.bold as any,
  },
  searchContainer: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  searchWrapper: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 25,
    borderWidth: 1,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.lg,
  },
  searchIcon: {
    marginRight: SPACING.xs,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: FONT_SIZE.md,
  },
  clearButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: FONT_WEIGHT.bold as any,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: FONT_SIZE.md,
  },
  tabsContainer: {
    marginBottom: SPACING.sm,
  },
  tabsContent: {
    paddingHorizontal: SPACING.lg,
  },
  tab: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    marginRight: SPACING.sm,
    borderRadius: 20,
  },
  activeTab: {
    borderRadius: 20,
  },
  tabText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.medium as any,
  },
  activeTabText: {
    fontWeight: FONT_WEIGHT.semibold as any,
  },
  listContent: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xs,
  },
  orderCard: {
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  orderNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: SPACING.sm,
  },
  orderIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  },
  orderTextContainer: {
    flex: 1,
  },
  orderName: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.semibold as any,
    marginBottom: 2,
  },
  orderIdText: {
    fontSize: FONT_SIZE.xs,
    color: 'gray',
  },
  orderDetailSection: {
    marginTop: SPACING.xs,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: `${COLORS.zinc[300]}20`,
  },
  orderDetailRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: SPACING.md,
    marginBottom: SPACING.sm,
  },
  costRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  specItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${COLORS.zinc[500]}08`,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    borderRadius: RADIUS.sm,
  },
  specIcon: {
    marginRight: SPACING.xs,
  },
  specValue: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.medium as any,
  },
  costContainer: {
    paddingVertical: SPACING.xs / 2,
    paddingHorizontal: SPACING.sm,
    borderRadius: RADIUS.sm,
    marginBottom: SPACING.xs,
  },
  orderCostText: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.semibold as any,
  },
  itemSeparator: {
    height: SPACING.md,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xxl,
  },
  emptyIcon: {
    marginBottom: SPACING.md,
  },
  emptyText: {
    fontSize: FONT_SIZE.md,
  },
  floatingAddButton: {
    position: 'absolute',
    right: SPACING.xl,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyListContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
});

export default Home;