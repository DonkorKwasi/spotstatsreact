"use client";
import { atom } from "jotai";
import { atomWithStorage } from 'jotai/utils'
export const trackSelected = atomWithStorage('select',null);
export let datas = null;