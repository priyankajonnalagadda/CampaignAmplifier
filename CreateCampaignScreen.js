
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';

const initialForm = {
  title: '',
  category: 'Health',
  story: '',
  visual: '',
  audience: '',
  impact: '',
  goal: '50000',
  days: '14',
};

const steps = ['Basics', 'Story', 'Visuals', 'Reach', 'Review'];

export default function CreateCampaignScreen({ onSubmitCampaign }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(initialForm);

  const update = (key, value) => {
    setForm((previous) => ({ ...previous, [key]: value }));
  };

  const next = () => {
    if (step === 0 && !form.title.trim()) {
      Alert.alert('Required', 'Please enter a campaign title.');
      return;
    }

    if (step === 1 && !form.story.trim()) {
      Alert.alert('Required', 'Please describe your campaign.');
      return;
    }

    if (step === 3 && (!form.audience.trim() || !form.impact.trim())) {
      Alert.alert('Required', 'Enter your target audience and why it matters.');
      return;
    }

    if (step < 4) {
      setStep(step + 1);
    } else {
      const campaign = {
        ...form,
        id: Date.now().toString(),
        raised: 0,
        goal: Number(form.goal) || 50000,
        days: Number(form.days) || 14,
      };

      onSubmitCampaign?.(campaign);
      Alert.alert('Campaign created!', 'Your campaign has been submitted.');
      setForm(initialForm);
      setStep(0);
    }
  };

  const field = (label, key, placeholder, multiline = false, keyboardType = 'default') => (
    <View style={styles.field} key={key}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={form[key]}
        onChangeText={(value) => update(key, value)}
        placeholder={placeholder}
        placeholderTextColor="#9299AA"
        multiline={multiline}
        keyboardType={keyboardType}
        style={[styles.input, multiline && styles.multiline]}
      />
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Create a campaign</Text>
      <Text style={styles.subtitle}>
        Share your idea with the people who can amplify it.
      </Text>

      <View style={styles.stepRow}>
        {steps.map((name, index) => (
          <View key={name} style={styles.stepItem}>
            <View style={[styles.stepCircle, index <= step && styles.stepActive]}>
              <Text style={[styles.stepNumber, index <= step && styles.stepNumberActive]}>
                {index + 1}
              </Text>
            </View>
            <Text style={[styles.stepName, index === step && styles.currentStep]}>
              {name}
            </Text>
          </View>
        ))}
      </View>

      {step === 0 && (
        <View style={styles.card}>
          <Text style={styles.cardHeading}>Campaign basics</Text>
          {field('Campaign title *', 'title', 'Give your campaign a clear title')}
          <Text style={styles.label}>Category</Text>
          <View style={styles.categories}>
            {['Health', 'Education', 'Environment', 'Community'].map((item) => (
              <TouchableOpacity
                key={item}
                onPress={() => update('category', item)}
                style={[styles.chip, form.category === item && styles.chipActive]}
              >
                <Text style={[styles.chipText, form.category === item && styles.chipTextActive]}>
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {step === 1 && (
        <View style={styles.card}>
          <Text style={styles.cardHeading}>Tell your story</Text>
          {field('Campaign message *', 'story', 'What message do you want people to hear?', true)}
          <Text style={styles.helper}>
            Explain the problem, your message, and the change you want to create.
          </Text>
        </View>
      )}

      {step === 2 && (
        <View style={styles.card}>
          <Text style={styles.cardHeading}>Campaign visuals</Text>
          {field('Image URL (optional)', 'visual', 'https://example.com/image.jpg')}
          <View style={styles.visualPlaceholder}>
            <Text style={styles.visualEmoji}>✦</Text>
            <Text style={styles.helper}>You can add an image URL now or leave it blank.</Text>
          </View>
        </View>
      )}

      {step === 3 && (
        <View style={styles.card}>
          <Text style={styles.cardHeading}>Reach the right audience</Text>
          {field('Target audience *', 'audience', 'Who needs to hear this message?')}
          {field('Why should it matter? *', 'impact', 'What impact could this create?', true)}
          {field('Funding goal (₹)', 'goal', '50000', false, 'numeric')}
          {field('Campaign duration (days)', 'days', '14', false, 'numeric')}
        </View>
      )}

      {step === 4 && (
        <View style={styles.card}>
          <Text style={styles.cardHeading}>Preview your campaign</Text>
          <Text style={styles.previewCategory}>{form.category.toUpperCase()}</Text>
          <Text style={styles.previewTitle}>{form.title}</Text>
          <Text style={styles.previewStory}>{form.story}</Text>
          {form.visual ? <Text style={styles.helper}>Visual URL: {form.visual}</Text> : null}
          <View style={styles.previewBox}>
            <Text style={styles.label}>TARGET AUDIENCE</Text>
            <Text style={styles.previewText}>{form.audience}</Text>
            <Text style={styles.label}>WHY IT MATTERS</Text>
            <Text style={styles.previewText}>{form.impact}</Text>
            <Text style={styles.label}>FUNDING GOAL</Text>
            <Text style={styles.previewText}>
              ₹{(Number(form.goal) || 50000).toLocaleString('en-IN')}
            </Text>
            <Text style={styles.label}>DURATION</Text>
            <Text style={styles.previewText}>{form.days || '14'} days</Text>
          </View>
        </View>
      )}

      <View style={styles.actions}>
        {step > 0 && (
          <TouchableOpacity style={styles.backButton} onPress={() => setStep(step - 1)}>
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.nextButton} onPress={next}>
          <Text style={styles.nextText}>
            {step === 4 ? 'Submit campaign' : 'Continue →'}
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.footer}>Step {step + 1} of 5</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F8FC' },
  content: { padding: 20, paddingBottom: 40 },
  heading: { fontSize: 26, fontWeight: '800', color: '#202943' },
  subtitle: { color: '#7A8195', fontSize: 13, lineHeight: 20, marginTop: 8 },
  stepRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 25 },
  stepItem: { alignItems: 'center', flex: 1 },
  stepCircle: {
    width: 30, height: 30, borderRadius: 15, backgroundColor: '#E5E8F0',
    justifyContent: 'center', alignItems: 'center',
  },
  stepActive: { backgroundColor: '#304B9B' },
  stepNumber: { color: '#7A8195', fontWeight: '700', fontSize: 12 },
  stepNumberActive: { color: '#FFFFFF' },
  stepName: { fontSize: 9, color: '#7A8195', marginTop: 6 },
  currentStep: { color: '#304B9B', fontWeight: '800' },
  card: { backgroundColor: '#FFFFFF', borderRadius: 18, padding: 18, borderWidth: 1, borderColor: '#ECEEF5' },
  cardHeading: { fontSize: 18, fontWeight: '800', color: '#202943', marginBottom: 20 },
  field: { marginBottom: 18 },
  label: { fontSize: 12, color: '#3B4560', fontWeight: '700', marginBottom: 8 },
  input: {
    borderWidth: 1, borderColor: '#DFE3ED', borderRadius: 11, padding: 13,
    color: '#202943', fontSize: 13, backgroundColor: '#FCFCFE',
  },
  multiline: { minHeight: 120, textAlignVertical: 'top' },
  categories: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 },
  chip: { borderWidth: 1, borderColor: '#DFE3ED', borderRadius: 20, paddingVertical: 9, paddingHorizontal: 12 },
  chipActive: { backgroundColor: '#304B9B', borderColor: '#304B9B' },
  chipText: { color: '#59627A', fontSize: 11 },
  chipTextActive: { color: '#FFFFFF', fontWeight: '700' },
  helper: { fontSize: 11, color: '#7A8195', lineHeight: 18, marginTop: 8 },
  visualPlaceholder: { alignItems: 'center', backgroundColor: '#F1F3FC', borderRadius: 12, padding: 22 },
  visualEmoji: { fontSize: 30, color: '#304B9B' },
  previewCategory: { color: '#526FD0', fontWeight: '800', fontSize: 10, letterSpacing: 1 },
  previewTitle: { color: '#202943', fontWeight: '800', fontSize: 21, marginTop: 8 },
  previewStory: { color: '#626C83', fontSize: 13, lineHeight: 21, marginTop: 10 },
  previewBox: { backgroundColor: '#F7F8FC', borderRadius: 12, padding: 14, marginTop: 20 },
  previewText: { color: '#202943', fontSize: 13, marginBottom: 16 },
  actions: { flexDirection: 'row', gap: 12, marginTop: 20 },
  backButton: { paddingVertical: 14, paddingHorizontal: 24, borderRadius: 12, borderWidth: 1, borderColor: '#304B9B' },
  backText: { color: '#304B9B', fontWeight: '700' },
  nextButton: { backgroundColor: '#304B9B', paddingVertical: 14, paddingHorizontal: 20, borderRadius: 12, flex: 1, alignItems: 'center' },
  nextText: { color: '#FFFFFF', fontWeight: '800', fontSize: 13 },
  footer: { textAlign: 'center', color: '#9299AA', fontSize: 11, marginTop: 18 },
});
