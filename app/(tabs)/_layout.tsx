import { Tabs } from 'expo-router';
import { Chrome as Home, UserPlus, User } from 'lucide-react-native';
import { COLORS } from '@/config/constants';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: COLORS.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontFamily: 'Inter-Medium',
          fontSize: 12,
        },
        headerShown: true,
        headerTitleStyle: {
          fontFamily: 'Inter-SemiBold',
          fontSize: 18,
        },
        headerStyle: {
          backgroundColor: COLORS.card,
        },
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Contacts',
          tabBarLabel: 'Contacts',
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="add-contact"
        options={{
          title: 'Add Contact',
          tabBarLabel: 'Add Contact',
          tabBarIcon: ({ color, size }) => <UserPlus color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'My Profile',
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}