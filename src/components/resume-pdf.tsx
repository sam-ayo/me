import {
  Document,
  Link,
  Page,
  StyleSheet,
  Text,
  View,
} from '@react-pdf/renderer';
import {
  contacts,
  education,
  experience,
  name,
  projects,
  skills,
  summary,
} from '@/lib/resume-data';

/* The PDF mirrors the resume page: light palette, one letter page, mono type
   for the meta lines and a proportional face for the prose. Helvetica and
   Courier ship with the renderer, so the route needs no font files. */
const colors = {
  primary: '#1a1a1a',
  secondary: '#4d4d4d',
  border: '#c7c7c7',
  badgeBackground: '#f0f0f0',
};

const styles = StyleSheet.create({
  page: {
    paddingVertical: 36,
    paddingHorizontal: 40,
    fontFamily: 'Helvetica',
    fontSize: 9,
    color: colors.primary,
    lineHeight: 1.4,
  },
  name: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 15,
    marginBottom: 6,
  },
  contactRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 6,
  },
  contact: {
    fontFamily: 'Courier',
    fontSize: 8,
    color: colors.secondary,
    textDecoration: 'none',
  },
  summary: {
    color: colors.secondary,
    marginBottom: 14,
  },
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: 'Courier-Bold',
    fontSize: 8,
    letterSpacing: 1.6,
    color: colors.secondary,
    marginBottom: 6,
  },
  rule: {
    borderTopWidth: 0.5,
    borderTopColor: colors.border,
    marginHorizontal: 4,
  },
  entry: {
    paddingHorizontal: 4,
    paddingVertical: 6,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    gap: 12,
    marginBottom: 3,
  },
  entryHeading: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 10,
    flexShrink: 1,
  },
  entrySubheading: {
    fontFamily: 'Helvetica',
    color: colors.secondary,
  },
  entryMeta: {
    fontFamily: 'Courier',
    fontSize: 8,
    color: colors.secondary,
  },
  point: {
    flexDirection: 'row',
    gap: 5,
    color: colors.secondary,
    marginBottom: 2,
  },
  pointText: {
    flexShrink: 1,
    color: colors.secondary,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 3,
  },
  badge: {
    fontFamily: 'Courier',
    fontSize: 7.5,
    color: colors.secondary,
    backgroundColor: colors.badgeBackground,
    borderRadius: 2,
    paddingHorizontal: 3,
    paddingVertical: 1.5,
  },
  skillGroup: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    paddingHorizontal: 4,
    marginBottom: 4,
  },
  skillLabel: {
    fontFamily: 'Courier',
    fontSize: 7.5,
    color: colors.secondary,
    width: 66,
    // Aligns the label with the badge text, which sits inside its own padding.
    paddingTop: 4.5,
  },
  educationLine: {
    color: colors.secondary,
  },
  educationLocation: {
    fontFamily: 'Courier',
    fontSize: 8,
    color: colors.secondary,
    marginBottom: 2,
  },
});

const Points = ({ points }: { points: string[] }) => (
  <View>
    {points.map((point) => (
      <View key={point} style={styles.point}>
        <Text>–</Text>
        <Text style={styles.pointText}>{point}</Text>
      </View>
    ))}
  </View>
);

const Badges = ({ items }: { items: string[] }) => (
  <View style={styles.badgeRow}>
    {items.map((item) => (
      <Text key={item} style={styles.badge}>
        {item}
      </Text>
    ))}
  </View>
);

const EntryHeader = ({
  heading,
  subheading,
  meta,
}: {
  heading: string;
  subheading?: string;
  meta: string;
}) => (
  <View style={styles.entryHeader}>
    <Text style={styles.entryHeading}>
      {heading}
      {subheading ? (
        <Text style={styles.entrySubheading}> · {subheading}</Text>
      ) : null}
    </Text>
    <Text style={styles.entryMeta}>{meta}</Text>
  </View>
);

/* Each entry keeps its own top rule, so a section that breaks across pages
   still shows a rule above every entry. */
const Entry = ({ children }: { children: React.ReactNode }) => (
  <View wrap={false}>
    <View style={styles.rule} />
    <View style={styles.entry}>{children}</View>
  </View>
);

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title.toUpperCase()}</Text>
    {children}
  </View>
);

export default function ResumePdf() {
  return (
    <Document title={`${name} — Resume`} author={name}>
      <Page size="LETTER" style={styles.page}>
        <Text style={styles.name}>{name}</Text>
        <View style={styles.contactRow}>
          {contacts.map((contact) => (
            <Link key={contact.label} src={contact.href} style={styles.contact}>
              {contact.print}
            </Link>
          ))}
        </View>
        <Text style={styles.summary}>{summary}</Text>

        <Section title="Experience">
          {experience.map((role) => (
            <Entry key={`${role.company}-${role.dates}`}>
              <EntryHeader
                heading={role.title}
                subheading={role.company}
                meta={role.dates}
              />
              <Points points={role.points} />
            </Entry>
          ))}
          <View style={styles.rule} />
        </Section>

        <Section title="Projects">
          {projects.map((project) => (
            <Entry key={project.title}>
              <EntryHeader heading={project.title} meta={project.date} />
              <Points points={project.points} />
              <Badges items={project.stack} />
            </Entry>
          ))}
          <View style={styles.rule} />
        </Section>

        <Section title="Skills">
          {skills.map((group) => (
            <View key={group.label} style={styles.skillGroup} wrap={false}>
              <Text style={styles.skillLabel}>{group.label.toUpperCase()}</Text>
              <Badges items={group.items} />
            </View>
          ))}
        </Section>

        <Section title="Education">
          <Entry>
            <EntryHeader heading={education.school} meta={education.dates} />
            <Text style={styles.educationLine}>{education.degree}</Text>
            <Text style={styles.educationLocation}>{education.location}</Text>
            <Points points={education.notes} />
          </Entry>
          <View style={styles.rule} />
        </Section>
      </Page>
    </Document>
  );
}
