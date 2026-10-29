"use client";

// The only client page: Keystatic's admin UI runs in the browser.
import { makePage } from "@keystatic/next/ui/app";
import config from "../../../../keystatic.config";

export default makePage(config);
