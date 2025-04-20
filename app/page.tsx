import { Suspense } from "react";
import styles from "./page.module.css";

export default async function Home() {

    return (
        <div className={styles.page}>
            <Suspense fallback={<p className={styles.loading}>loading...</p>}>
                <button className={styles.button}>
                    <a href="/tickets">
                        Login as Bot
                    </a>
                </button>
            </Suspense>
        </div>
    );
}
