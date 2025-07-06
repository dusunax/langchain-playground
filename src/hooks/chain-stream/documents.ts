import { Document } from "@langchain/core/documents";

export const documents = [
  new Document({
    pageContent: "mitochondria is the powerhouse of the cell",
    metadata: { topic: "biology" },
  }),
  new Document({
    pageContent: "hair is made of protein",
    metadata: { topic: "biology" },
  }),
  new Document({
    pageContent: "buildings are made of brick",
    metadata: { topic: "architecture" },
  }),
  new Document({
    pageContent: "skyscrapers are tall buildings",
    metadata: { topic: "architecture" },
  }),
  new Document({
    pageContent: "apartment buildings are tall buildings",
    metadata: { topic: "architecture" },
  }),
  new Document({
    pageContent: "a house is not a home",
    metadata: { topic: "architecture" },
  }),
  new Document({
    pageContent: "the sun is dying",
    metadata: { topic: "physics" },
  }),
  new Document({
    pageContent: "the moon is not a planet",
    metadata: { topic: "astronomy" },
  }),
  new Document({
    pageContent: "the sun is a star",
    metadata: { topic: "astronomy" },
  }),
  new Document({
    pageContent: "the stars are alive",
    metadata: { topic: "astronomy" },
  }),
  new Document({
    pageContent: "the mars is a planet",
    metadata: { topic: "astronomy" },
  }),
  new Document({
    pageContent: "the sky is blue",
    metadata: { topic: "color" },
  }),
  new Document({
    pageContent: "the grass is green",
    metadata: { topic: "color" },
  }),
  new Document({
    pageContent: "the moon is bright",
    metadata: { topic: "color" },
  }),
  new Document({
    pageContent: "the stars are bright",
    metadata: { topic: "color" },
  }),
  new Document({
    pageContent: "the sun is a bright object",
    metadata: { topic: "color" },
  }),
  new Document({
    pageContent: "a rose is red",
    metadata: { topic: "color" },
  }),
  new Document({
    pageContent: "a rose is a flower",
    metadata: { topic: "biology" },
  }),
  new Document({
    pageContent: "Rose is a person's name",
    metadata: { topic: "person" },
  }),
  new Document({
    pageContent: "Rose is live in UK",
    metadata: { topic: "person" },
  }),
];
