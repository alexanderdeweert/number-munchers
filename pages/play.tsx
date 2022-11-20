import Head from "next/head";
import Image from "next/image";
import { SetStateAction, useState } from "react";
import styles from "../styles/Home.module.css";
import { useRouter } from "next/router";

export default function Play() {
  const router = useRouter();
  return (
    <div>
      <h1>{router.query.a}</h1>
    </div>
  );
}
