// src/mail/templates/welcome-email.tsx
import { Html, Head, Preview, Body, Container, Text, Heading, Link, Section } from '@react-email/components';

interface WelcomeEmailProps {
    name: string;
}

export const WelcomeEmail = ({ name }: WelcomeEmailProps) => {
    return (
        <Html>
            <Head />
            <Preview>Welcome to QuestFeed! We're thrilled to have you.</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Heading style={heading}>
                        Welcome to QuestFeed, {name}!
                    </Heading>

                    <Text style={paragraph}>
                        Your account has been successfully created. We built QuestFeed to be a space where you can connect, share your ideas, and discover content that genuinely interests you.
                    </Text>

                    <Text style={paragraph}>
                        Whether you are here to explore the latest discussions or share your own perspective, we want you to feel right at home.
                    </Text>

                    <Section style={btnContainer}>
                        <Link style={button} href="https://questfeed.com/explore">
                            Explore QuestFeed
                        </Link>
                    </Section>

                    <Text style={footerText}>
                        If you have any questions or need a hand getting started, simply reply to this email—we are always here to help.
                    </Text>

                    <Text style={signature}>
                        Welcome aboard,<br />
                        The QuestFeed Team
                    </Text>
                </Container>
            </Body>
        </Html>
    );
};

const main = {
    backgroundColor: '#f4f4f5',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    padding: '40px 0',
};

const container = {
    backgroundColor: '#ffffff',
    margin: '0 auto',
    padding: '40px',
    borderRadius: '8px',
    maxWidth: '560px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
};

const heading = {
    color: '#18181b',
    fontSize: '22px',
    fontWeight: '600',
    lineHeight: '28px',
    marginBottom: '24px',
};

const paragraph = {
    color: '#52525b',
    fontSize: '16px',
    lineHeight: '24px',
    marginBottom: '16px',
};

const btnContainer = {
    textAlign: 'center' as const,
    margin: '32px 0',
};

const button = {
    backgroundColor: '#18181b',
    borderRadius: '6px',
    color: '#ffffff',
    fontSize: '15px',
    fontWeight: '500',
    textDecoration: 'none',
    textAlign: 'center' as const,
    display: 'inline-block',
    padding: '12px 24px',
};

const footerText = {
    color: '#71717a',
    fontSize: '14px',
    lineHeight: '20px',
    marginBottom: '24px',
};

const signature = {
    color: '#52525b',
    fontSize: '15px',
    lineHeight: '22px',
    borderTop: '1px solid #e4e4e7',
    paddingTop: '20px',
    marginTop: '20px',
};