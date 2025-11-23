import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  TextInput,
  Alert,
} from 'react-native'
import { FontAwesome } from '@expo/vector-icons'
import { useDarkMode } from '../../contexts/DarkModeContext'
import { useAuth } from '../../providers'
import { useRouter } from 'expo-router'

const SettingsScreen = () => {
  const { colors } = useDarkMode()
  const { user } = useAuth()
  const router = useRouter()

  // ---- LOCAL UI STATE (later connect to backend) ----
  const [isPublicProfile, setIsPublicProfile] = useState(true)
  const [showInSearch, setShowInSearch] = useState(true)

  const [showEmail, setShowEmail] = useState(false)
  const [showLocation, setShowLocation] = useState(true)
  const [showStats, setShowStats] = useState(true)
  const [showLastSeen, setShowLastSeen] = useState(false)
  const [showActivity, setShowActivity] = useState(true)

  const [followPolicy, setFollowPolicy] = useState<'everyone' | 'approve' | 'noone'>('everyone')
  const [messagePolicy, setMessagePolicy] = useState<'everyone' | 'followers' | 'noone'>('followers')
  const [autoApproveFollowers, setAutoApproveFollowers] = useState(true)

  const [enableSubscription, setEnableSubscription] = useState(false)
  const [subscriptionPrice, setSubscriptionPrice] = useState('4.99')
  const [allowTips, setAllowTips] = useState(true)

  const handleSave = () => {
    // Later: send all these values to your backend API.
    console.log('Saving settings (UI only for now)...', {
      isPublicProfile,
      showInSearch,
      showEmail,
      showLocation,
      showStats,
      showLastSeen,
      showActivity,
      followPolicy,
      messagePolicy,
      autoApproveFollowers,
      enableSubscription,
      subscriptionPrice,
      allowTips,
    })

    Alert.alert('Saved', 'Profile settings will be connected to the backend later.')
  }

  const handleManageBlocked = () => {
    Alert.alert(
      'Blocked users',
      'Here you will manage blocked users once we connect to the backend.'
    )
    // later: router.push('/(profile)/blocked')
  }

  const handleDownloadData = () => {
    Alert.alert(
      'Download your data',
      'In the future this will export your profile, posts and activity data.'
    )
  }

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete account',
      'We will implement secure account deletion with confirmation and backup later.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Understood', style: 'destructive' },
      ]
    )
  }

  const renderFollowPolicyPill = (
    value: 'everyone' | 'approve' | 'noone',
    label: string,
    description?: string
  ) => {
    const active = followPolicy === value
    return (
      <TouchableOpacity
        style={[styles.pill, active && styles.pillActive]}
        onPress={() => setFollowPolicy(value)}
      >
        <Text style={[styles.pillLabel, active && styles.pillLabelActive]}>
          {label}
        </Text>
        {description ? (
          <Text style={styles.pillDesc}>{description}</Text>
        ) : null}
      </TouchableOpacity>
    )
  }

  const renderMessagePolicyPill = (
    value: 'everyone' | 'followers' | 'noone',
    label: string
  ) => {
    const active = messagePolicy === value
    return (
      <TouchableOpacity
        style={[styles.smallPill, active && styles.smallPillActive]}
        onPress={() => setMessagePolicy(value)}
      >
        <Text style={[styles.smallPillLabel, active && styles.smallPillLabelActive]}>
          {label}
        </Text>
      </TouchableOpacity>
    )
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: 32 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header intro */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          Profile Settings
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Control what people see, who can follow you and how you monetize your presence on Mukulah.
        </Text>
      </View>

      {/* SECTION: Visibility */}
      <View
        style={[
          styles.card,
          { backgroundColor: colors.surface, borderColor: '#111827' },
        ]}
      >
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderLeft}>
            <FontAwesome name='eye' size={18} color='#F5C451' />
            <Text style={[styles.cardTitle, { color: colors.text }]}>
              Profile Visibility
            </Text>
          </View>
        </View>

        <View style={styles.rowSetting}>
          <View style={styles.rowText}>
            <Text style={[styles.rowTitle, { color: colors.text }]}>
              Public profile
            </Text>
            <Text style={styles.rowSubtitle}>
              When off, only approved followers can see your full profile.
            </Text>
          </View>
          <Switch
            value={isPublicProfile}
            onValueChange={setIsPublicProfile}
            trackColor={{ false: '#4B5563', true: '#F5C451' }}
            thumbColor={isPublicProfile ? '#fff' : '#f4f3f4'}
          />
        </View>

        <View style={styles.rowSetting}>
          <View style={styles.rowText}>
            <Text style={[styles.rowTitle, { color: colors.text }]}>
              Show in search results
            </Text>
            <Text style={styles.rowSubtitle}>
              Allow others to discover you when they search by name, interests or categories.
            </Text>
          </View>
          <Switch
            value={showInSearch}
            onValueChange={setShowInSearch}
            trackColor={{ false: '#4B5563', true: '#F5C451' }}
            thumbColor={showInSearch ? '#fff' : '#f4f3f4'}
          />
        </View>
      </View>

      {/* SECTION: What others can see */}
      <View
        style={[
          styles.card,
          { backgroundColor: colors.surface, borderColor: '#111827' },
        ]}
      >
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderLeft}>
            <FontAwesome name='id-card' size={18} color='#F5C451' />
            <Text style={[styles.cardTitle, { color: colors.text }]}>
              What others can see
            </Text>
          </View>
        </View>

        <View style={styles.rowSetting}>
          <View style={styles.rowText}>
            <Text style={[styles.rowTitle, { color: colors.text }]}>
              Show email
            </Text>
            <Text style={styles.rowSubtitle}>
              Display your email on your public profile for contact and business.
            </Text>
          </View>
          <Switch
            value={showEmail}
            onValueChange={setShowEmail}
            trackColor={{ false: '#4B5563', true: '#F5C451' }}
            thumbColor={showEmail ? '#fff' : '#f4f3f4'}
          />
        </View>

        <View style={styles.rowSetting}>
          <View style={styles.rowText}>
            <Text style={[styles.rowTitle, { color: colors.text }]}>
              Show location
            </Text>
            <Text style={styles.rowSubtitle}>
              Show city / country on your public profile and listings.
            </Text>
          </View>
          <Switch
            value={showLocation}
            onValueChange={setShowLocation}
            trackColor={{ false: '#4B5563', true: '#F5C451' }}
            thumbColor={showLocation ? '#fff' : '#f4f3f4'}
          />
        </View>

        <View style={styles.rowSetting}>
          <View style={styles.rowText}>
            <Text style={[styles.rowTitle, { color: colors.text }]}>
              Show stats
            </Text>
            <Text style={styles.rowSubtitle}>
              Display followers, following, ratings and reviews on your profile.
            </Text>
          </View>
          <Switch
            value={showStats}
            onValueChange={setShowStats}
            trackColor={{ false: '#4B5563', true: '#F5C451' }}
            thumbColor={showStats ? '#fff' : '#f4f3f4'}
          />
        </View>

        <View style={styles.rowSetting}>
          <View style={styles.rowText}>
            <Text style={[styles.rowTitle, { color: colors.text }]}>
              Show activity
            </Text>
            <Text style={styles.rowSubtitle}>
              Allow others to see public posts, reviews and activity.
            </Text>
          </View>
          <Switch
            value={showActivity}
            onValueChange={setShowActivity}
            trackColor={{ false: '#4B5563', true: '#F5C451' }}
            thumbColor={showActivity ? '#fff' : '#f4f3f4'}
          />
        </View>

        <View style={styles.rowSetting}>
          <View style={styles.rowText}>
            <Text style={[styles.rowTitle, { color: colors.text }]}>
              Show last seen
            </Text>
            <Text style={styles.rowSubtitle}>
              Show when you were last active on Mukulah.
            </Text>
          </View>
          <Switch
            value={showLastSeen}
            onValueChange={setShowLastSeen}
            trackColor={{ false: '#4B5563', true: '#F5C451' }}
            thumbColor={showLastSeen ? '#fff' : '#f4f3f4'}
          />
        </View>
      </View>

      {/* SECTION: Followers & interactions */}
      <View
        style={[
          styles.card,
          { backgroundColor: colors.surface, borderColor: '#111827' },
        ]}
      >
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderLeft}>
            <FontAwesome name='users' size={18} color='#F5C451' />
            <Text style={[styles.cardTitle, { color: colors.text }]}>
              Followers & interactions
            </Text>
          </View>
        </View>

        <Text style={[styles.smallTitle, { color: colors.text }]}>
          Who can follow you?
        </Text>
        <View style={styles.pillsRow}>
          {renderFollowPolicyPill(
            'everyone',
            'Everyone',
            'Anyone can follow your profile.'
          )}
          {renderFollowPolicyPill(
            'approve',
            'Approval only',
            'You must approve follow requests.'
          )}
          {renderFollowPolicyPill(
            'noone',
            'No one',
            'Only people you manually share with.'
          )}
        </View>

        {followPolicy === 'approve' && (
          <View style={[styles.rowSetting, { marginTop: 10 }]}>
            <View style={styles.rowText}>
              <Text style={[styles.rowTitle, { color: colors.text }]}>
                Auto-approve trusted users
              </Text>
              <Text style={styles.rowSubtitle}>
                Followers you already interacted with (orders, chats) can be auto-approved.
              </Text>
            </View>
            <Switch
              value={autoApproveFollowers}
              onValueChange={setAutoApproveFollowers}
              trackColor={{ false: '#4B5563', true: '#F5C451' }}
              thumbColor={autoApproveFollowers ? '#fff' : '#f4f3f4'}
            />
          </View>
        )}

        <View style={{ marginTop: 14 }}>
          <Text style={[styles.smallTitle, { color: colors.text }]}>
            Who can message you?
          </Text>
          <View style={styles.smallPillsRow}>
            {renderMessagePolicyPill('everyone', 'Everyone')}
            {renderMessagePolicyPill('followers', 'Followers only')}
            {renderMessagePolicyPill('noone', 'No one')}
          </View>
        </View>
      </View>

      {/* SECTION: Subscriptions & monetization */}
      <View
        style={[
          styles.card,
          { backgroundColor: colors.surface, borderColor: '#111827' },
        ]}
      >
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderLeft}>
            <FontAwesome name='diamond' size={18} color='#F5C451' />
            <Text style={[styles.cardTitle, { color: colors.text }]}>
              Subscriptions & monetization
            </Text>
          </View>
        </View>

        <View style={styles.rowSetting}>
          <View style={styles.rowText}>
            <Text style={[styles.rowTitle, { color: colors.text }]}>
              Enable paid subscription
            </Text>
            <Text style={styles.rowSubtitle}>
              Let followers subscribe monthly for exclusive content and benefits.
            </Text>
          </View>
          <Switch
            value={enableSubscription}
            onValueChange={setEnableSubscription}
            trackColor={{ false: '#4B5563', true: '#F5C451' }}
            thumbColor={enableSubscription ? '#fff' : '#f4f3f4'}
          />
        </View>

        {enableSubscription && (
          <View style={{ marginTop: 8 }}>
            <Text style={[styles.rowTitle, { color: colors.text }]}>
              Monthly price (EUR)
            </Text>
            <TextInput
              style={styles.priceInput}
              keyboardType='decimal-pad'
              placeholder='e.g. 4.99'
              placeholderTextColor='#6B7280'
              value={subscriptionPrice}
              onChangeText={setSubscriptionPrice}
            />
          </View>
        )}

        <View style={[styles.rowSetting, { marginTop: 14 }]}>
          <View style={styles.rowText}>
            <Text style={[styles.rowTitle, { color: colors.text }]}>
              Allow tips / donations
            </Text>
            <Text style={styles.rowSubtitle}>
              Let people send you one-time support payments (coming soon).
            </Text>
          </View>
          <Switch
            value={allowTips}
            onValueChange={setAllowTips}
            trackColor={{ false: '#4B5563', true: '#F5C451' }}
            thumbColor={allowTips ? '#fff' : '#f4f3f4'}
          />
        </View>
      </View>

      {/* SECTION: Safety & data */}
      <View
        style={[
          styles.card,
          { backgroundColor: colors.surface, borderColor: '#111827' },
        ]}
      >
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderLeft}>
            <FontAwesome name='shield' size={18} color='#F87171' />
            <Text style={[styles.cardTitle, { color: colors.text }]}>
              Safety & data
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.actionRow}
          onPress={handleManageBlocked}
        >
          <FontAwesome name='ban' size={16} color='#F87171' />
          <View style={{ flex: 1 }}>
            <Text style={[styles.actionTitle, { color: colors.text }]}>
              Blocked users
            </Text>
            <Text style={styles.actionSubtitle}>
              Review profiles you’ve blocked and unblock if needed.
            </Text>
          </View>
          <FontAwesome name='chevron-right' size={14} color='#9CA3AF' />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionRow}
          onPress={handleDownloadData}
        >
          <FontAwesome name='download' size={16} color='#F5C451' />
          <View style={{ flex: 1 }}>
            <Text style={[styles.actionTitle, { color: colors.text }]}>
              Download your data
            </Text>
            <Text style={styles.actionSubtitle}>
              Export a copy of your profile, posts and activity history.
            </Text>
          </View>
          <FontAwesome name='chevron-right' size={14} color='#9CA3AF' />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionRow, { borderTopWidth: 0 }]}
          onPress={handleDeleteAccount}
        >
          <FontAwesome name='trash' size={16} color='#DC2626' />
          <View style={{ flex: 1 }}>
            <Text style={[styles.actionTitle, { color: '#FCA5A5' }]}>
              Delete account (future)
            </Text>
            <Text style={[styles.actionSubtitle, { color: '#FCA5A5' }]}>
              Permanently delete your account and all associated data.
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* SAVE BUTTON */}
      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveText}>Save changes</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

export default SettingsScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
  },
  subtitle: {
    marginTop: 6,
    fontSize: 13,
    color: '#9CA3AF',
  },
  card: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
  },
  cardHeader: {
    marginBottom: 6,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  rowSetting: {
    flexDirection: 'row',
    marginTop: 10,
    alignItems: 'center',
  },
  rowText: {
    flex: 1,
    marginRight: 10,
  },
  rowTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  rowSubtitle: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  smallTitle: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 6,
  },
  pillsRow: {
    marginTop: 4,
    gap: 8,
  },
  pill: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#374151',
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 8,
  },
  pillActive: {
    borderColor: '#F5C451',
    backgroundColor: '#111827',
  },
  pillLabel: {
    fontSize: 13,
    color: '#E5E7EB',
    fontWeight: '600',
  },
  pillLabelActive: {
    color: '#F5C451',
  },
  pillDesc: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 3,
  },
  smallPillsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  smallPill: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#374151',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  smallPillActive: {
    borderColor: '#F5C451',
    backgroundColor: '#111827',
  },
  smallPillLabel: {
    fontSize: 12,
    color: '#E5E7EB',
  },
  smallPillLabelActive: {
    color: '#F5C451',
    fontWeight: '600',
  },
  priceInput: {
    marginTop: 6,
    backgroundColor: '#111827',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#F9FAFB',
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#1F2937',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#111827',
  },
  actionTitle: {
    fontSize: 13,
    fontWeight: '600',
  },
  actionSubtitle: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 2,
  },
  saveBtn: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 24,
    backgroundColor: '#F5C451',
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveText: {
    color: '#050509',
    fontSize: 15,
    fontWeight: '700',
  },
})
