import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import styles from '@/styles/Home.module.css';
import ClientSdk from '@project/client-sdk';
ClientSdk.db8;
const Meta = () => {
  return (
    <Head>
      <title>Create Gluestack App</title>
      <meta name="description" content="Generated by node glue add web" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
};

const FeatureCard = ({ iconSvg, name, desc }: any) => {
  return (
    <div className={styles.card}>
      <div>
        <Image
          src={`/${iconSvg}`}
          alt="document"
          width={22}
          height={22}
          priority
        />
        <h3>{name}</h3>
      </div>
      <p>{desc}</p>
    </div>
  );
};

const Example = () => {
  return (
    <div className={styles.container}>
      <div className={styles.gradient}>
        <Image src="/gradient.svg" alt="Gradient" fill priority />
      </div>
      <main className={styles.main}>
        <p className={styles.badge}>
          Get started by editing <code>pages/index.tsx</code>
        </p>

        <div className={styles.logo}>
          <Image src="/logo.svg" fill alt="logo" priority />
        </div>

        <div className={styles.grid}>
          <FeatureCard
            iconSvg="document-data.svg"
            name="Docs"
            desc="Find in-depth information about gluestack features and API."
          />
          <FeatureCard
            iconSvg="lightbulb-person.svg"
            name="Learn"
            desc="Learn about gluestack in an interactive course with quizzes!"
          />
          <FeatureCard
            iconSvg="rocket.svg"
            name="Deploy"
            desc="Instantly drop your gluestack site to a shareable URL with vercel."
          />
        </div>
      </main>
    </div>
  );
};

const Home: NextPage = () => {
  return (
    <div className={styles.parent}>
      <Meta />
      <Example />
    </div>
  );
};

export default Home;
