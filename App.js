
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  StatusBar,
  Alert,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import CreateCampaignScreen from './CreateCampaignScreen';

const Tab = createBottomTabNavigator();

const STORAGE_KEY = 'campaigns';

const initialCampaigns = [
  {
    id: '1',
    emoji: '🌱',
    category: 'ENVIRONMENT',
    title: 'Plant 1,000 Trees',
    description:
      'Help local volunteers plant trees and create a greener, healthier community.',
    story:
      'Our community wants to plant 1,000 trees in public spaces and schools. Every contribution helps us purchase saplings and support volunteers.',
    audience: 'Local communities',
    impact: 'Plant 1,000 trees',
    raised: 6500,
    goal: 10000,
    days: 12,
    color: '#E5F4E8',
  },
  {
    id: '2',
    emoji: '📚',
    category: 'EDUCATION',
    title: 'Books for Every Child',
    description:
      'Support access to learning materials for children who need them most.',
    story:
      'We are collecting funds to provide books and learning materials to children in underserved communities.',
    audience: 'Students and families',
    impact: 'Provide learning materials',
    raised: 4200,
    goal: 8000,
    days: 8,
    color: '#E9E8FF',
  },
  {
    id: '3',
    emoji: '❤️',
    category: 'HEALTH',
    title: 'Community Health Drive',
    description:
      'Spread awareness and support basic health resources for local families.',
    story:
      'Our volunteers are organizing a community health awareness drive and need support for essential materials.',
    audience: 'Local families',
    impact: 'Support a health awareness drive',
    raised: 7200,
    goal: 12000,
    days: 15,
    color: '#FFE9E5',
  },
  {
    id: '4',
    emoji: '🤝',
    category: 'COMMUNITY',
    title: 'Help Families in Need',
    description:
      'Bring people together to support families facing difficult circumstances.',
    story:
      'We want to connect people who can help with families who need community support.',
    audience: 'Families in need',
    impact: 'Support local families',
    raised: 3000,
    goal: 7000,
    days: 6,
    color: '#FFF0D9',
  },
];

const COLORS = {
  background: '#F7F8FC',
  white: '#FFFFFF',
  dark: '#20233A',
  muted: '#777B91',
  purple: '#6558E8',
  lightPurple: '#EEECFF',
  green: '#229A68',
  border: '#E8E9F1',
};

function money(value) {
  return '₹' + Number(value || 0).toLocaleString('en-IN');
}

function ProgressBar({ raised, goal }) {
  const percentage =
    goal > 0 ? Math.min((Number(raised) / Number(goal)) * 100, 100) : 0;

  return (
    <View style={styles.progressTrack}>
      <View
        style={[
          styles.progressFill,
          { width: `${percentage}%` },
        ]}
      />
    </View>
  );
}

function CampaignCard({ campaign, onPress }) {
  const progress =
    campaign.goal > 0
      ? Math.min(
          Math.round((campaign.raised / campaign.goal) * 100),
          100
        )
      : 0;

  return (
    <TouchableOpacity
      style={styles.campaignCard}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View
        style={[
          styles.campaignImage,
          { backgroundColor: campaign.color || COLORS.lightPurple },
        ]}
      >
        <Text style={styles.campaignEmoji}>
          {campaign.emoji || '📣'}
        </Text>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>
            {campaign.category || 'COMMUNITY'}
          </Text>
        </View>
      </View>

      <View style={styles.campaignContent}>
        <Text style={styles.campaignTitle}>{campaign.title}</Text>

        <Text style={styles.campaignDescription} numberOfLines={2}>
          {campaign.description || campaign.story || ''}
        </Text>

        <View style={styles.amountRow}>
          <Text style={styles.raisedAmount}>
            {money(campaign.raised)}
          </Text>
          <Text style={styles.goalAmount}>
            of {money(campaign.goal)}
          </Text>
          <Text style={styles.progressPercentage}>{progress}%</Text>
        </View>

        <ProgressBar raised={campaign.raised} goal={campaign.goal} />

        <View style={styles.cardFooter}>
          <Text style={styles.daysText}>
            ⏳ {campaign.days || 7} days left
          </Text>
          <Text style={styles.backText}>View campaign →</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function ScreenHeader({ title, subtitle }) {
  return (
    <View style={styles.screenHeader}>
      <Text style={styles.screenTitle}>{title}</Text>
      {!!subtitle && (
        <Text style={styles.screenSubtitle}>{subtitle}</Text>
      )}
    </View>
  );
}

function HomeScreen({ campaigns, onSelectCampaign, onExplore }) {
  const totalRaised = campaigns.reduce(
    (sum, campaign) => sum + Number(campaign.raised || 0),
    0
  );

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.topBar}>
        <View>
          <Text style={styles.brand}>
            amplify<Text style={styles.brandDot}>.</Text>
          </Text>
          <Text style={styles.brandSubtitle}>
            Small actions. Big impact.
          </Text>
        </View>

        <View style={styles.avatar}>
          <Text style={styles.avatarText}>A</Text>
        </View>
      </View>

      <View style={styles.hero}>
        <Text style={styles.heroEyebrow}>YOUR VOICE MATTERS</Text>
        <Text style={styles.heroTitle}>
          Turn your passion into a movement.
        </Text>
        <Text style={styles.heroDescription}>
          Discover meaningful campaigns and help important messages
          reach more people.
        </Text>

        <TouchableOpacity
          style={styles.heroButton}
          onPress={onExplore}
        >
          <Text style={styles.heroButtonText}>
            Explore campaigns  →
          </Text>
        </TouchableOpacity>

        <Text style={styles.heroEmoji}>📣</Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{campaigns.length}</Text>
          <Text style={styles.statLabel}>Campaigns</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            {money(totalRaised)}
          </Text>
          <Text style={styles.statLabel}>Demo funds raised</Text>
        </View>
      </View>

      <View style={styles.sectionHeading}>
        <View>
          <Text style={styles.sectionTitle}>Trending campaigns</Text>
          <Text style={styles.sectionSubtitle}>
            Causes making a difference
          </Text>
        </View>

        <TouchableOpacity onPress={onExplore}>
          <Text style={styles.seeAll}>See all</Text>
        </TouchableOpacity>
      </View>

      {campaigns.slice(0, 3).map((campaign) => (
        <CampaignCard
          key={String(campaign.id)}
          campaign={campaign}
          onPress={() => onSelectCampaign(campaign)}
        />
      ))}

      {campaigns.length === 0 && (
        <Text style={styles.emptyText}>
          No campaigns yet. Create the first one!
        </Text>
      )}

      <View style={styles.bottomNote}>
        <Text style={styles.bottomNoteEmoji}>💜</Text>
        <Text style={styles.bottomNoteText}>
          Every voice counts. Every action matters.
        </Text>
      </View>
    </ScrollView>
  );
}

function ExploreScreen({ campaigns, onSelectCampaign }) {
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  const filters = [
    'ALL',
    'HEALTH',
    'EDUCATION',
    'ENVIRONMENT',
    'COMMUNITY',
  ];

  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesCategory =
      activeFilter === 'ALL' ||
      String(campaign.category || '').toUpperCase() === activeFilter;

    const query = search.trim().toLowerCase();

    const matchesSearch =
      !query ||
      String(campaign.title || '').toLowerCase().includes(query) ||
      String(campaign.description || '').toLowerCase().includes(query) ||
      String(campaign.category || '').toLowerCase().includes(query);

    return matchesCategory && matchesSearch;
  });

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <ScreenHeader
        title="Explore"
        subtitle="Find a cause you believe in."
      />

      <TextInput
        style={styles.searchInput}
        placeholder="🔎  Search campaigns..."
        placeholderTextColor={COLORS.muted}
        value={search}
        onChangeText={setSearch}
      />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
      >
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter}
            onPress={() => setActiveFilter(filter)}
            style={[
              styles.filterChip,
              activeFilter === filter && styles.activeFilterChip,
            ]}
          >
            <Text
              style={[
                styles.filterText,
                activeFilter === filter && styles.activeFilterText,
              ]}
            >
              {filter === 'ALL'
                ? 'All causes'
                : filter.charAt(0) + filter.slice(1).toLowerCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={styles.resultsText}>
        {filteredCampaigns.length} campaigns found
      </Text>

      {filteredCampaigns.map((campaign) => (
        <CampaignCard
          key={String(campaign.id)}
          campaign={campaign}
          onPress={() => onSelectCampaign(campaign)}
        />
      ))}

      {filteredCampaigns.length === 0 && (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyEmoji}>🔍</Text>
          <Text style={styles.emptyTitle}>No campaigns found</Text>
          <Text style={styles.emptyText}>
            Try another search or category.
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

function ActivityScreen({ activities }) {
  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.scrollContent}
    >
      <ScreenHeader
        title="Activity"
        subtitle="See the difference you're making."
      />

      {activities.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyEmoji}>✨</Text>
          <Text style={styles.emptyTitle}>Your activity starts here</Text>
          <Text style={styles.emptyText}>
            Create a campaign or support a cause to see activity here.
          </Text>
        </View>
      ) : (
        activities.map((activity) => (
          <View key={activity.id} style={styles.activityCard}>
            <View style={styles.activityIcon}>
              <Text style={styles.activityEmoji}>
                {activity.emoji || '💜'}
              </Text>
            </View>
            <View style={styles.activityDetails}>
              <Text style={styles.activityTitle}>
                {activity.title}
              </Text>
              <Text style={styles.activityDescription}>
                {activity.description}
              </Text>
              <Text style={styles.activityTime}>
                {activity.time}
              </Text>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}

function ProfileScreen({ campaigns, activities }) {
  const totalRaised = campaigns.reduce(
    (sum, campaign) => sum + Number(campaign.raised || 0),
    0
  );

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.scrollContent}
    >
      <ScreenHeader
        title="Your profile"
        subtitle="A little change can go a long way."
      />

      <View style={styles.profileCard}>
        <View style={styles.profileAvatar}>
          <Text style={styles.profileAvatarText}>A</Text>
        </View>
        <Text style={styles.profileName}>Amplify Supporter</Text>
        <Text style={styles.profileDescription}>
          Making good things happen, one action at a time.
        </Text>
      </View>

      <View style={styles.profileStats}>
        <View style={styles.profileStat}>
          <Text style={styles.profileStatNumber}>
            {campaigns.length}
          </Text>
          <Text style={styles.profileStatLabel}>Campaigns</Text>
        </View>

        <View style={styles.profileStat}>
          <Text style={styles.profileStatNumber}>
            {activities.length}
          </Text>
          <Text style={styles.profileStatLabel}>Activities</Text>
        </View>

        <View style={styles.profileStat}>
          <Text style={styles.profileStatNumber}>
            {money(totalRaised)}
          </Text>
          <Text style={styles.profileStatLabel}>Demo funds</Text>
        </View>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>About amplify.</Text>
        <Text style={styles.infoDescription}>
          A campaign amplification prototype that helps people
          discover causes, create campaigns, and support messages
          that matter.
        </Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Demo notice</Text>
        <Text style={styles.infoDescription}>
          Campaign funding is simulated for demonstration. No real
          payment or social media promotion takes place.
        </Text>
      </View>
    </ScrollView>
  );
}

function CampaignDetailsScreen({
  campaign,
  onBack,
  onFund,
}) {
  if (!campaign) return null;

  const percentage =
    campaign.goal > 0
      ? Math.min(
          Math.round((campaign.raised / campaign.goal) * 100),
          100
        )
      : 0;

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.scrollContent}
    >
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Text style={styles.backButtonText}>←  Back to campaigns</Text>
      </TouchableOpacity>

      <View
        style={[
          styles.detailsHero,
          { backgroundColor: campaign.color || COLORS.lightPurple },
        ]}
      >
        <Text style={styles.detailsEmoji}>
          {campaign.emoji || '📣'}
        </Text>
        <Text style={styles.detailsCategory}>
          {campaign.category || 'COMMUNITY'}
        </Text>
      </View>

      <Text style={styles.detailsTitle}>{campaign.title}</Text>

      <Text style={styles.detailsDescription}>
        {campaign.description || campaign.story}
      </Text>

      <View style={styles.detailsFundingCard}>
        <Text style={styles.fundingLabel}>Demo funding progress</Text>

        <View style={styles.detailsAmountRow}>
          <Text style={styles.detailsRaised}>
            {money(campaign.raised)}
          </Text>
          <Text style={styles.detailsGoal}>
            of {money(campaign.goal)}
          </Text>
        </View>

        <ProgressBar raised={campaign.raised} goal={campaign.goal} />

        <Text style={styles.detailsProgress}>
          {percentage}% of the goal reached
        </Text>
      </View>

      {!!campaign.story && (
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>The story</Text>
          <Text style={styles.infoDescription}>{campaign.story}</Text>
        </View>
      )}

      {!!campaign.audience && (
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Who this helps</Text>
          <Text style={styles.infoDescription}>
            {campaign.audience}
          </Text>
        </View>
      )}

      {!!campaign.impact && (
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Expected impact</Text>
          <Text style={styles.infoDescription}>
            {campaign.impact}
          </Text>
        </View>
      )}

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Campaign timeline</Text>
        <Text style={styles.infoDescription}>
          {campaign.days || 7} days remaining
        </Text>
      </View>

      <TouchableOpacity
        style={styles.fundButton}
        onPress={() => onFund(campaign)}
      >
        <Text style={styles.fundButtonText}>
          💜  Support this campaign
        </Text>
      </TouchableOpacity>

      <Text style={styles.demoDisclaimer}>
        Demo only: this button adds a simulated ₹500 contribution.
        No payment is processed.
      </Text>
    </ScrollView>
  );
}

function TabIcon({ name, focused }) {
  const icons = {
    Home: focused ? '🏠' : '⌂',
    Explore: focused ? '🔎' : '⌕',
    Create: '＋',
    Activity: focused ? '💜' : '♡',
    Profile: focused ? '👤' : '♙',
  };

  return (
    <View
      style={[
        styles.tabIconWrap,
        focused && name === 'Create' && styles.createTabIconWrap,
      ]}
    >
      <Text
        style={[
          styles.tabIconText,
          focused && name === 'Create' && styles.createTabIconText,
        ]}
      >
        {icons[name]}
      </Text>
    </View>
  );
}

export default function App() {
  const [campaigns, setCampaigns] = useState(initialCampaigns);
  const [activities, setActivities] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [storageLoaded, setStorageLoaded] = useState(false);

  // Load campaigns saved on the device.
  useEffect(() => {
    const loadCampaigns = async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);

        if (saved !== null) {
          setCampaigns(JSON.parse(saved));
        }
      } catch (error) {
        console.log('Could not load campaigns:', error);
      } finally {
        setStorageLoaded(true);
      }
    };

    loadCampaigns();
  }, []);

  // Save campaigns whenever the list changes.
  useEffect(() => {
    if (!storageLoaded) return;

    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(campaigns)).catch(
      (error) => console.log('Could not save campaigns:', error)
    );
  }, [campaigns, storageLoaded]);

  const addCampaign = (newCampaign) => {
    const campaign = {
      ...newCampaign,
      id: String(newCampaign.id || Date.now()),
      emoji: newCampaign.emoji || '📣',
      category: String(newCampaign.category || 'COMMUNITY').toUpperCase(),
      description:
        newCampaign.description ||
        newCampaign.story ||
        'A new community campaign.',
      raised: Number(newCampaign.raised || 0),
      goal: Number(newCampaign.goal || 1000),
      days: Number(newCampaign.days || 7),
      color: newCampaign.color || '#EEECFF',
    };

    setCampaigns((previous) => [campaign, ...previous]);

    setActivities((previous) => [
      {
        id: String(Date.now()),
        emoji: '🎉',
        title: 'Campaign created',
        description: campaign.title,
        time: 'Just now',
      },
      ...previous,
    ]);
  };

  const fundCampaign = (campaignToFund) => {
    Alert.alert(
      'Support this campaign?',
      'This is a prototype. No real payment will be taken. A simulated ₹500 contribution will be added.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Confirm demo support',
          onPress: () => {
            const updatedCampaign = {
              ...campaignToFund,
              raised:
                Number(campaignToFund.raised || 0) + 500,
            };

            setCampaigns((previous) =>
              previous.map((campaign) =>
                String(campaign.id) === String(campaignToFund.id)
                  ? updatedCampaign
                  : campaign
              )
            );

            setSelectedCampaign(updatedCampaign);

            setActivities((previous) => [
              {
                id: String(Date.now()),
                emoji: '💜',
                title: 'Campaign supported',
                description:
                  `You added a demo contribution to "${campaignToFund.title}".`,
                time: 'Just now',
              },
              ...previous,
            ]);

            Alert.alert(
              'Thank you!',
              'Your simulated ₹500 contribution was added successfully.'
            );
          },
        },
      ]
    );
  };

  const openCampaign = (campaign) => {
    setSelectedCampaign(campaign);
  };

  const closeCampaign = () => {
    setSelectedCampaign(null);
  };

  if (selectedCampaign) {
    return (
      <NavigationContainer>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={COLORS.background}
        />
        <CampaignDetailsScreen
          campaign={
            campaigns.find(
              (item) =>
                String(item.id) === String(selectedCampaign.id)
            ) || selectedCampaign
          }
          onBack={closeCampaign}
          onFund={fundCampaign}
        />
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={COLORS.background}
      />

      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: COLORS.purple,
          tabBarInactiveTintColor: COLORS.muted,
          tabBarStyle: styles.tabBar,
          tabBarLabelStyle: styles.tabLabel,
          tabBarIcon: ({ focused }) => (
            <TabIcon name={route.name} focused={focused} />
          ),
        })}
      >
        <Tab.Screen name="Home">
          {({ navigation }) => (
            <HomeScreen
              campaigns={campaigns}
              onSelectCampaign={openCampaign}
              onExplore={() => navigation.navigate('Explore')}
            />
          )}
        </Tab.Screen>

        <Tab.Screen name="Explore">
          {() => (
            <ExploreScreen
              campaigns={campaigns}
              onSelectCampaign={openCampaign}
            />
          )}
        </Tab.Screen>

        <Tab.Screen name="Create">
          {() => (
            <CreateCampaignScreen onSubmitCampaign={addCampaign} />
          )}
        </Tab.Screen>

        <Tab.Screen name="Activity">
          {() => <ActivityScreen activities={activities} />}
        </Tab.Screen>

        <Tab.Screen name="Profile">
          {() => (
            <ProfileScreen
              campaigns={campaigns}
              activities={activities}
            />
          )}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 55,
    paddingBottom: 35,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  brand: {
    color: COLORS.dark,
    fontSize: 29,
    fontWeight: '800',
    letterSpacing: -1,
  },
  brandDot: {
    color: COLORS.purple,
  },
  brandSubtitle: {
    color: COLORS.muted,
    fontSize: 12,
    marginTop: 2,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.lightPurple,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: COLORS.purple,
    fontWeight: '800',
    fontSize: 18,
  },
  hero: {
    backgroundColor: '#282544',
    borderRadius: 25,
    padding: 23,
    marginBottom: 18,
    overflow: 'hidden',
  },
  heroEyebrow: {
    color: '#C7C1FF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  heroTitle: {
    color: COLORS.white,
    fontSize: 27,
    lineHeight: 34,
    fontWeight: '800',
    maxWidth: '88%',
  },
  heroDescription: {
    color: '#D4D1E8',
    fontSize: 13,
    lineHeight: 20,
    marginTop: 12,
    maxWidth: '90%',
  },
  heroButton: {
    backgroundColor: '#8175FF',
    borderRadius: 12,
    paddingVertical: 13,
    paddingHorizontal: 15,
    alignSelf: 'flex-start',
    marginTop: 20,
  },
  heroButtonText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 13,
  },
  heroEmoji: {
    position: 'absolute',
    right: 12,
    bottom: 14,
    fontSize: 57,
    opacity: 0.22,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 28,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 17,
    padding: 17,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statNumber: {
    color: COLORS.dark,
    fontSize: 21,
    fontWeight: '800',
  },
  statLabel: {
    color: COLORS.muted,
    fontSize: 11,
    marginTop: 5,
  },
  sectionHeading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    color: COLORS.dark,
    fontSize: 19,
    fontWeight: '800',
  },
  sectionSubtitle: {
    color: COLORS.muted,
    fontSize: 12,
    marginTop: 4,
  },
  seeAll: {
    color: COLORS.purple,
    fontWeight: '700',
    fontSize: 12,
  },
  campaignCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 16,
    overflow: 'hidden',
  },
  campaignImage: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  campaignEmoji: {
    fontSize: 48,
  },
  categoryBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#FFFFFFE8',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  categoryText: {
    color: COLORS.dark,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  campaignContent: {
    padding: 16,
  },
  campaignTitle: {
    color: COLORS.dark,
    fontSize: 17,
    fontWeight: '800',
  },
  campaignDescription: {
    color: COLORS.muted,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 7,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 9,
  },
  raisedAmount: {
    color: COLORS.dark,
    fontWeight: '800',
    fontSize: 15,
  },
  goalAmount: {
    color: COLORS.muted,
    fontSize: 11,
    marginLeft: 5,
    flex: 1,
  },
  progressPercentage: {
    color: COLORS.green,
    fontWeight: '800',
    fontSize: 12,
  },
  progressTrack: {
    width: '100%',
    height: 7,
    borderRadius: 10,
    backgroundColor: '#EDEDF5',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.purple,
    borderRadius: 10,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 13,
    alignItems: 'center',
  },
  daysText: {
    color: COLORS.muted,
    fontSize: 11,
  },
  backText: {
    color: COLORS.purple,
    fontSize: 11,
    fontWeight: '700',
  },
  screenHeader: {
    marginBottom: 22,
  },
  screenTitle: {
    color: COLORS.dark,
    fontSize: 28,
    fontWeight: '800',
  },
  screenSubtitle: {
    color: COLORS.muted,
    fontSize: 13,
    marginTop: 6,
  },
  searchInput: {
    height: 50,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    paddingHorizontal: 15,
    color: COLORS.dark,
    marginBottom: 16,
  },
  filterRow: {
    gap: 8,
    paddingBottom: 16,
  },
  filterChip: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 22,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  activeFilterChip: {
    backgroundColor: COLORS.purple,
    borderColor: COLORS.purple,
  },
  filterText: {
    color: COLORS.muted,
    fontSize: 11,
    fontWeight: '700',
  },
  activeFilterText: {
    color: COLORS.white,
  },
  resultsText: {
    color: COLORS.muted,
    fontSize: 12,
    marginBottom: 14,
  },
  emptyCard: {
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 30,
    marginTop: 8,
  },
  emptyEmoji: {
    fontSize: 38,
    marginBottom: 12,
  },
  emptyTitle: {
    color: COLORS.dark,
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'center',
  },
  emptyText: {
    color: COLORS.muted,
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: 8,
  },
  bottomNote: {
    alignItems: 'center',
    marginTop: 12,
    padding: 20,
  },
  bottomNoteEmoji: {
    fontSize: 25,
    marginBottom: 7,
  },
  bottomNoteText: {
    color: COLORS.muted,
    fontSize: 12,
    textAlign: 'center',
  },
  activityCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 17,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  activityIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: COLORS.lightPurple,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 13,
  },
  activityEmoji: {
    fontSize: 21,
  },
  activityDetails: {
    flex: 1,
  },
  activityTitle: {
    color: COLORS.dark,
    fontSize: 14,
    fontWeight: '800',
  },
  activityDescription: {
    color: COLORS.muted,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 5,
  },
  activityTime: {
    color: COLORS.purple,
    fontSize: 10,
    marginTop: 8,
  },
  profileCard: {
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 22,
    padding: 25,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.lightPurple,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 13,
  },
  profileAvatarText: {
    color: COLORS.purple,
    fontSize: 32,
    fontWeight: '800',
  },
  profileName: {
    color: COLORS.dark,
    fontSize: 19,
    fontWeight: '800',
  },
  profileDescription: {
    color: COLORS.muted,
    textAlign: 'center',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 7,
  },
  profileStats: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 18,
    paddingVertical: 20,
    marginTop: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  profileStat: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  profileStatNumber: {
    color: COLORS.purple,
    fontWeight: '800',
    fontSize: 17,
  },
  profileStatLabel: {
    color: COLORS.muted,
    fontSize: 10,
    marginTop: 6,
    textAlign: 'center',
  },
  infoCard: {
    backgroundColor: COLORS.white,
    borderRadius: 17,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  infoTitle: {
    color: COLORS.dark,
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 8,
  },
  infoDescription: {
    color: COLORS.muted,
    fontSize: 13,
    lineHeight: 21,
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: 10,
    marginBottom: 12,
  },
  backButtonText: {
    color: COLORS.purple,
    fontWeight: '700',
    fontSize: 13,
  },
  detailsHero: {
    height: 190,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 22,
  },
  detailsEmoji: {
    fontSize: 70,
    marginBottom: 12,
  },
  detailsCategory: {
    color: COLORS.dark,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  detailsTitle: {
    color: COLORS.dark,
    fontSize: 25,
    lineHeight: 32,
    fontWeight: '800',
  },
  detailsDescription: {
    color: COLORS.muted,
    fontSize: 14,
    lineHeight: 22,
    marginTop: 10,
    marginBottom: 20,
  },
  detailsFundingCard: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 15,
  },
  fundingLabel: {
    color: COLORS.muted,
    fontSize: 12,
    marginBottom: 10,
  },
  detailsAmountRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  detailsRaised: {
    color: COLORS.dark,
    fontSize: 26,
    fontWeight: '800',
  },
  detailsGoal: {
    color: COLORS.muted,
    fontSize: 12,
    marginLeft: 7,
  },
  detailsProgress: {
    color: COLORS.green,
    fontSize: 11,
    fontWeight: '700',
    marginTop: 10,
  },
  fundButton: {
    backgroundColor: COLORS.purple,
    borderRadius: 15,
    paddingVertical: 17,
    alignItems: 'center',
    marginTop: 5,
  },
  fundButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '800',
  },
  demoDisclaimer: {
    color: COLORS.muted,
    fontSize: 11,
    lineHeight: 17,
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 15,
  },
  tabBar: {
    height: 68,
    paddingTop: 7,
    paddingBottom: 7,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
  },
  tabIconWrap: {
    minWidth: 30,
    minHeight: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIconText: {
    fontSize: 21,
    color: COLORS.purple,
  },
  createTabIconWrap: {
    backgroundColor: COLORS.purple,
    width: 37,
    height: 32,
    borderRadius: 11,
  },
  createTabIconText: {
    color: COLORS.white,
    fontSize: 25,
    lineHeight: 29,
  },
});
