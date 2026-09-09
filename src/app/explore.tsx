import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Collapsible } from '@/components/ui/collapsible';
import { WebBadge } from '@/components/web-badge';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const initialIds: string[] = ['truffle-pasta', 'pan-seared-salmon', 'burrata-caprese', 'lava-cake'];

const initialDishNames: string[] = [
  'Truffle Mushroom Pasta',
  'Pan-Seared Salmon',
  'Burrata Caprese',
  'Molten Chocolate Lava Cake',
];

const initialDescriptions: string[] = [
  'Handcrafted fettuccine tossed in a velvet black truffle cream sauce with sautéed wild mushrooms, aged parmesan, and fresh herbs.',
  'Crispy skin Atlantic salmon filet served on a bed of lemon-herb asparagus risotto and finished with a citrus reduction.',
  'Creamy Italian burrata cheese paired with heirloom tomatoes, basil oil, aged balsamic glaze, and toasted sourdough slices.',
  'Warm dark chocolate cake with a molten chocolate center, served with Madagascar vanilla bean ice cream and fresh berries.',
];

const initialCourses: string[] = ['Main', 'Main', 'Starter', 'Dessert'];

const initialPrices: string[] = ['32.50', '38.00', '14.50', '11.00'];

const initialGoodCounts: number[] = [5, 12, 9, 7];

const initialBadCounts: number[] = [2, 1, 0, 3];

function formatRand(price: string): string {
  if (!price) return '—';
  const numeric = Number(price);
  if (Number.isNaN(numeric)) return `R${price}`;
  return `R${numeric.toFixed(2)}`;
}

export default function TabTwoScreen() {
  const safeAreaInsets = useSafeAreaInsets();
  const insets = {
    ...safeAreaInsets,
    bottom: safeAreaInsets.bottom + BottomTabInset + Spacing.three,
  };
  const theme = useTheme();

  const [ids, setIds] = useState<string[]>(initialIds);
  const [dishNames, setDishNames] = useState<string[]>(initialDishNames);
  const [descriptions, setDescriptions] = useState<string[]>(initialDescriptions);
  const [courses, setCourses] = useState<string[]>(initialCourses);
  const [prices, setPrices] = useState<string[]>(initialPrices);
  const [goodCounts, setGoodCounts] = useState<number[]>(initialGoodCounts);
  const [badCounts, setBadCounts] = useState<number[]>(initialBadCounts);

  const [dishName, setDishName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [course, setCourse] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');

  const isFormComplete: boolean =
    dishName.trim() !== '' &&
    description.trim() !== '' &&
    course.trim() !== '' &&
    price.trim() !== '';

  useEffect(() => {
    if (!feedbackMessage) return;
    const timeout = setTimeout(() => setFeedbackMessage(''), 3000);
    return () => clearTimeout(timeout);
  }, [feedbackMessage]);

  const addMenuItem = (): void => {
    if (!isFormComplete) return;

    const trimmedDishName = dishName.trim();
    const newId = `${trimmedDishName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;

    setIds((prev) => [...prev, newId]);
    setDishNames((prev) => [...prev, trimmedDishName]);
    setDescriptions((prev) => [...prev, description.trim()]);
    setCourses((prev) => [...prev, course.trim()]);
    setPrices((prev) => [...prev, price.trim()]);
    setGoodCounts((prev) => [...prev, 0]);
    setBadCounts((prev) => [...prev, 0]);

    setFeedbackMessage(`"${trimmedDishName}" was added to the menu.`);
    setDishName('');
    setDescription('');
    setCourse('');
    setPrice('');
  };

  const contentPlatformStyle = Platform.select({
    android: {
      paddingTop: insets.top,
      paddingLeft: insets.left,
      paddingRight: insets.right,
      paddingBottom: insets.bottom,
    },
    web: {
      paddingTop: Spacing.six,
      paddingBottom: Spacing.four,
    },
  });

  return (
    <ScrollView
      style={[styles.scrollView, { backgroundColor: theme.background }]}
      contentInset={insets}
      contentContainerStyle={[styles.contentContainer, contentPlatformStyle]}>
      <ThemedView style={styles.container}>
        <ThemedText style={styles.welcomeText}>Welcome Chef</ThemedText>

        {/* Add new menu item form */}
        <ThemedView type="backgroundElement" style={[styles.formContainer, styles.redBackground]}>
          <ThemedText type="subtitle">Add a New Dish</ThemedText>

          <ThemedView style={styles.fieldGroup}>
            <ThemedText type="smallBold">Dish Name</ThemedText>
            <TextInput
              value={dishName}
              onChangeText={setDishName}
              placeholder="e.g. Steak"
              placeholderTextColor={theme.textSecondary}
              style={[styles.input, { color: theme.text, borderColor: theme.textSecondary }]}
            />
          </ThemedView>

          <ThemedView style={styles.fieldGroup}>
            <ThemedText type="smallBold">Description</ThemedText>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="description of the dish"
              placeholderTextColor={theme.textSecondary}
              multiline
              numberOfLines={3}
              style={[
                styles.input,
                styles.textArea,
                { color: theme.text, borderColor: theme.textSecondary },
              ]}
            />
          </ThemedView>

          <ThemedView style={styles.fieldGroup}>
            <ThemedText type="smallBold">Course</ThemedText>
            <TextInput
              value={course}
              onChangeText={setCourse}
              placeholder="e.g. Starter, Main, Dessert"
              placeholderTextColor={theme.textSecondary}
              style={[styles.input, { color: theme.text, borderColor: theme.textSecondary }]}
            />
          </ThemedView>

          <ThemedView style={styles.fieldGroup}>
            <ThemedText type="smallBold">Price (R)</ThemedText>
            <TextInput
              value={price}
              onChangeText={setPrice}
              placeholder="e.g. 109.75"
              placeholderTextColor={theme.textSecondary}
              keyboardType="decimal-pad"
              style={[styles.input, { color: theme.text, borderColor: theme.textSecondary }]}
            />
          </ThemedView>

          <Pressable
            onPress={addMenuItem}
            disabled={!isFormComplete}
            style={({ pressed }) => [
              styles.addButton,
              !isFormComplete && styles.addButtonDisabled,
              pressed && isFormComplete && styles.addButtonPressed,
            ]}>
            <ThemedText style={styles.addButtonText}>+ Add Dish</ThemedText>
          </Pressable>

          {feedbackMessage ? (
            <ThemedText style={styles.feedbackText}>{feedbackMessage}</ThemedText>
          ) : null}
        </ThemedView>

        <ThemedText type="subtitle" style={styles.menuHeading}>
          Menu
        </ThemedText>

        <ThemedView style={styles.sectionsWrapper}>
          {dishNames.map((name, index) => (
            <Collapsible key={ids[index]} title={name}>
              <ThemedView type="backgroundElement" style={[styles.collapsibleContent, styles.redBackground]}>
                <ThemedText type="small">{descriptions[index] || 'No description provided.'}</ThemedText>

                <ThemedView style={styles.metaRow}>
                  <ThemedText type="smallBold">Course: </ThemedText>
                  <ThemedText type="small">{courses[index] || '—'}</ThemedText>
                </ThemedView>
                <ThemedView style={styles.metaRow}>
                  <ThemedText type="smallBold">Price: </ThemedText>
                  <ThemedText type="small">{formatRand(prices[index])}</ThemedText>
                </ThemedView>

                {/* Customer review - display only, not interactive */}
                <ThemedView style={styles.reviewSection}>
                  <ThemedText type="smallBold">Customer Review</ThemedText>
                  <ThemedView style={styles.reviewRow}>
                    <ThemedText style={styles.goodText}>Good +{goodCounts[index]}</ThemedText>
                    <ThemedText style={styles.badText}>Bad {badCounts[index]}</ThemedText>
                  </ThemedView>
                </ThemedView>
              </ThemedView>
            </Collapsible>
          ))}

          
        </ThemedView>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  container: {
    maxWidth: MaxContentWidth,
    flexGrow: 1,
  },
  welcomeText: {
    color: '#0040ff',
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: Spacing.six,
    paddingHorizontal: Spacing.four,
  },

  redBackground: {
    backgroundColor: '#cde7fe',
  },
  formContainer: {
    marginHorizontal: Spacing.four,
    marginTop: Spacing.four,
    padding: Spacing.four,
    borderRadius: Spacing.three,
    gap: Spacing.three,
  },
  fieldGroup: {
    gap: Spacing.one,
  },
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: Spacing.two,
    padding: Spacing.two,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  addButton: {
    marginTop: Spacing.two,
    backgroundColor: '#00ff1a',
    paddingVertical: Spacing.three,
    borderRadius: Spacing.three,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  addButtonDisabled: {
    backgroundColor: '#64646473',
    shadowOpacity: 0,
    elevation: 0,
  },
  addButtonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  feedbackText: {
    color: '#2E9E5B',
    fontSize: 13,
    textAlign: 'center',
    marginTop: Spacing.one,
  },
  menuHeading: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.six,
  },
  sectionsWrapper: {
    gap: Spacing.five,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
  },
  collapsibleContent: {
    alignItems: 'flex-start',
    gap: Spacing.one,
  },
  metaRow: {
    flexDirection: 'row',
  },
  reviewSection: {
    marginTop: Spacing.two,
    gap: Spacing.two,
    width: '100%',
  },
  reviewRow: {
    flexDirection: 'row',
    gap: Spacing.four,
  },
  goodText: {
    color: '#1eff00',
    fontWeight: '600',
    fontSize: 14,
  },
  badText: {
    color: '#D64545',
    fontWeight: '600',
    fontSize: 14,
  },
  imageTutorial: {
    width: '100%',
    aspectRatio: 296 / 171,
    borderRadius: Spacing.three,
    marginTop: Spacing.two,
  },
});
