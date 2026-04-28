import { StyleSheet, Text, View } from 'react-native';

export default function ScreenHeader({ title, subtitle, children }) {
  return (
    <View style={[styles.header, children && styles.headerWithActions]}>
      <View style={styles.titleGroup}>
        <Text style={[styles.title, children && styles.titleWithActions]}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {children ? <View style={styles.actions}>{children}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#000000',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#E3000B',
  },
  headerWithActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E3000B',
  },
  titleGroup: {
    flex: 1,
  },
  titleWithActions: {
    textAlign: 'left',
  },
  subtitle: {
    color: '#C7C7C7',
    marginTop: 4,
    fontSize: 13,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
});
