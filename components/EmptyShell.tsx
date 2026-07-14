import styles from "./EmptyShell.module.css";

export default function EmptyShell({ title }: { title: string }) {
  return (
    <div className={styles.wrap}>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.note}>This section will be added later.</p>
    </div>
  );
}
