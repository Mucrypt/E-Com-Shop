/**
 * CommonStyles.ts - Reusable component styles using theme system
 */

import { StyleSheet } from 'react-native'
import Colors from './Colors'
import Typography from './Typography'
import Spacing from './Spacing'
import BorderRadius from './BorderRadius'
import Shadows from './Shadows'

export const CommonStyles = StyleSheet.create({
  // Container Styles
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  
  safeContainer: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  
  scrollContainer: {
    paddingHorizontal: Spacing[4],
    paddingTop: Spacing[3],
    paddingBottom: Spacing[6],
  },
  
  // Card Styles
  card: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.border.primary,
    ...Shadows.sm,
  },
  
  cardElevated: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.border.primary,
    ...Shadows.md,
  },
  
  cardContent: {
    padding: Spacing[4],
  },
  
  // Button Styles
  buttonPrimary: {
    backgroundColor: Colors.primary[500],
    borderRadius: BorderRadius.full,
    paddingVertical: Spacing[3],
    paddingHorizontal: Spacing[6],
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.accent,
  },
  
  buttonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.border.secondary,
    borderRadius: BorderRadius.full,
    paddingVertical: Spacing[3],
    paddingHorizontal: Spacing[6],
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.primary[500],
    borderRadius: BorderRadius.full,
    paddingVertical: Spacing[3],
    paddingHorizontal: Spacing[6],
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Text Styles
  textPrimary: {
    color: Colors.text.primary,
    ...Typography.styles.body,
  },
  
  textSecondary: {
    color: Colors.text.secondary,
    ...Typography.styles.bodySmall,
  },
  
  textMuted: {
    color: Colors.text.muted,
    ...Typography.styles.caption,
  },
  
  textAccent: {
    color: Colors.primary[500],
    fontWeight: Typography.weights.semibold,
  },
  
  // Header Styles
  header: {
    backgroundColor: Colors.background.primary,
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.primary,
  },
  
  headerTitle: {
    ...Typography.styles.h4,
    color: Colors.text.primary,
    textAlign: 'center',
  },
  
  // Input Styles
  input: {
    backgroundColor: Colors.background.tertiary,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border.primary,
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[3],
    color: Colors.text.primary,
    ...Typography.styles.body,
  },
  
  inputFocused: {
    borderColor: Colors.primary[500],
  },
  
  // List Styles
  listContainer: {
    paddingHorizontal: Spacing[4],
  },
  
  listItem: {
    paddingVertical: Spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.primary,
  },
  
  listItemLast: {
    borderBottomWidth: 0,
  },
  
  // Navigation Styles
  tabBar: {
    backgroundColor: Colors.components.navigation.background,
    borderTopColor: Colors.components.navigation.border,
    borderTopWidth: 1,
    paddingBottom: Spacing[2],
    paddingTop: Spacing[2],
    height: 80,
  },
  
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.overlay.backdrop,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  modalContent: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius['2xl'],
    padding: Spacing[6],
    margin: Spacing[4],
    maxWidth: '90%',
    ...Shadows.xl,
  },
  
  // Layout Helpers
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  
  column: {
    flexDirection: 'column',
  },
  
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Spacing Helpers
  mb1: { marginBottom: Spacing[1] },
  mb2: { marginBottom: Spacing[2] },
  mb3: { marginBottom: Spacing[3] },
  mb4: { marginBottom: Spacing[4] },
  mb6: { marginBottom: Spacing[6] },
  
  mt1: { marginTop: Spacing[1] },
  mt2: { marginTop: Spacing[2] },
  mt3: { marginTop: Spacing[3] },
  mt4: { marginTop: Spacing[4] },
  mt6: { marginTop: Spacing[6] },
  
  p1: { padding: Spacing[1] },
  p2: { padding: Spacing[2] },
  p3: { padding: Spacing[3] },
  p4: { padding: Spacing[4] },
  p6: { padding: Spacing[6] },
  
  px1: { paddingHorizontal: Spacing[1] },
  px2: { paddingHorizontal: Spacing[2] },
  px3: { paddingHorizontal: Spacing[3] },
  px4: { paddingHorizontal: Spacing[4] },
  px6: { paddingHorizontal: Spacing[6] },
  
  py1: { paddingVertical: Spacing[1] },
  py2: { paddingVertical: Spacing[2] },
  py3: { paddingVertical: Spacing[3] },
  py4: { paddingVertical: Spacing[4] },
  py6: { paddingVertical: Spacing[6] },
})

export default CommonStyles