// LCEL Cheatsheet
// https://js.langchain.com/docs/how_to/lcel_cheatsheet

/**
 * # LCEL Cheatsheet
 * 1. invoke
 * 2. batch
 * 3. stream
 * 4. compose (chain)
 * 5. parallel
 * 6. handle dictionary and conditions
 * 7. Bind & Pick:
 * 8. Error handling
 * 9. Choose Runnable Dynamically
 * 10. Generate a stream of internal events
 * 11. Declaratively make a batched version of a runnable
 */

import {
  RunnableLambda,
  RunnableMap,
  RunnableParallel,
  RunnablePassthrough,
  RunnableSequence,
  type RunnableConfig,
} from "@langchain/core/runnables";

const addOne = (x: number) => x + 1;
const multiplyTwo = (x: number) => x * 2;
const toAlphabet = (x: number) => String.fromCharCode(x + 64);
const runnable1 = RunnableLambda.from(addOne);

// ------------------------------------------------------------
// 1. invoke
console.log(`1. invoke: ${await runnable1.invoke(1)}`); // 2

// ------------------------------------------------------------
// 2. batch
console.log("\n");
console.log(`2. batch: ${await runnable1.batch([1, 2, 3])}`); // [2, 3, 4]

// ------------------------------------------------------------
// 3. stream
console.log("\n");
console.log("3. stream:");

async function* genFn(x: number[]) {
  for (const e of x) {
    yield addOne(e);
  }
}
const runnable2 = RunnableLambda.from(genFn);
const stream = await runnable2.stream([1, 2, 3]);

for await (const chunk of stream) {
  console.log(chunk); // 2, 3, 4
}

// ------------------------------------------------------------
// 4. compose (chain)
console.log("\n");
console.log("4. compose:");

const runnable3 = RunnableLambda.from(toAlphabet);
const chainedWithPipe = runnable1.pipe(runnable3); // runnable1 -> runnable3

console.log(`chainedWithPipe: 1 to ${await chainedWithPipe.invoke(1)}`); // B
console.log(
  `chainedWithPipe: [1, 2, 3] to ${await chainedWithPipe.batch([1, 2, 3])}`
); // [B, C, D]

const chainedWithSequence = RunnableSequence.from([runnable1, runnable3]); // runnable1 -> runnable3
console.log(`chainedWithSequence: 1 to ${await chainedWithSequence.invoke(1)}`); // B
console.log(
  `chainedWithSequence: [1, 2, 3] to ${await chainedWithSequence.batch([
    1, 2, 3,
  ])}`
); // [B, C, D]

// ------------------------------------------------------------
// 5. parallel
console.log("\n");
console.log("5. parallel:");

const parallel1 = RunnableParallel.from({
  addOne: runnable1,
  toAlphabet: runnable3,
});
console.log(await parallel1.invoke(1)); // { 0: 2, 1: 'A' }
console.log(await parallel1.batch([1, 2, 3])); // [ { 0: 2, 1: 'A' }, { 0: 3, 1: 'B' }, { 0: 4, 1: 'C' } ]

// ------------------------------------------------------------
// 6. handle dictionary and conditions
console.log("\n");
console.log("6. dictionary and conditions:");

enum Gender {
  Male = "male",
  Female = "female",
  Other = "other",
}
interface PersonInput {
  firstName: string | null;
  lastName: string | null;
  gender: Gender;
}
interface PersonOutput {
  person: PersonInput;
  introduction: string;
}
const John: PersonInput = {
  firstName: "John",
  lastName: "Snow",
  gender: "male" as Gender,
};
const NoName: PersonInput = {
  firstName: null,
  lastName: null,
  gender: "other" as Gender,
};

const addFullName = (x: PersonInput) => {
  const { firstName, lastName } = x;
  let fullName = "";
  if (!firstName || !lastName) {
    fullName = "No one";
  } else {
    fullName = `${firstName} ${lastName}`;
  }
  return { ...x, fullName };
};
const getGenderPronounsForIntroduction = ({
  gender,
  fullName,
}: PersonInput & { fullName: string }) => {
  let introduction = "";
  if (gender === Gender.Male) introduction = "He's name is";
  if (gender === Gender.Female) introduction = "She's name is";
  if (gender === Gender.Other) introduction = "Their name is";
  return `${introduction} ${fullName}`;
};

const runnable4 = RunnableLambda.from(addFullName);
const runnable5 = RunnableLambda.from(getGenderPronounsForIntroduction);
const runnableCombine = RunnableSequence.from([runnable4, runnable5]); // 📌

// 6-1. Include input dict in output dict: new RunnablePassthrough()
const parallel2: RunnableMap<PersonInput, PersonOutput> = RunnableParallel.from(
  {
    introduction: runnableCombine,
    person: new RunnablePassthrough<PersonInput>(),
  }
);
console.log(await parallel2.invoke(John));
console.log(await parallel2.invoke(NoName));

// 6-2. Merge input and output dicts: RunnablePassthrough.assign()
type PersonInputWithUnknownIndexKey = PersonInput & {
  [key: string]: unknown;
};
const chainWithPassthroughAssign =
  RunnablePassthrough.assign<PersonInputWithUnknownIndexKey>({
    // 📌
    person: runnable4,
  });
console.log(
  await chainWithPassthroughAssign.invoke(
    John as PersonInputWithUnknownIndexKey
  )
);

// ------------------------------------------------------------
// 7. Bind & Pick:
console.log("\n");
console.log("7. bind & pick:");

// Runnable.bind(): deprecated. binding args to return value
// Runnable.pick(): pick specific keys from the output
const branchedFn = (mainArg: Record<string, any>, config?: RunnableConfig) => {
  if (config?.configurable?.boundKey !== undefined) {
    return { ...mainArg, boundKey: config?.configurable?.boundKey };
  }
  return mainArg;
};
const runnable6 = RunnableLambda.from(branchedFn);
const boundRunnable6 = runnable6.bind({
  configurable: {
    boundKey: { cat: "🐱", dog: "🐶" },
  },
});
const fooBar = { foo: "hello", bar: "world", me: "👩‍💻" };
console.log(await boundRunnable6.invoke(fooBar));
console.log(await boundRunnable6.pick("foo").invoke(fooBar)); // getting the value
console.log(await boundRunnable6.pick(["foo", "boundKey"]).invoke(fooBar)); // getting the keys

// ------------------------------------------------------------
// 8. Error handling
console.log("\n");
console.log("8. error handling:");

// 📌 Runnable.withFallback([fallback])
const runnable7 = RunnableLambda.from((x: string) => {
  throw new Error("Error case");
});
const fallback = RunnableLambda.from((x: string): never => {
  console.log("fallback function executed with input:", x);

  throw new Error("fallback");
});
try {
  const chainWithFallback = runnable7.withFallbacks([fallback]); // 📌
  await chainWithFallback.invoke("foo");
} catch (error) {}

// 📌 Add retries
let count = 0;
const retryFn = () => {
  console.log("retry function executed, count:", count++);
  throw new Error("Error case");
};
const runnable8 = RunnableLambda.from(retryFn);
const chainWithRetry = runnable8.withRetry({ stopAfterAttempt: 3 });
try {
  console.log(await chainWithRetry.invoke("foo"));
} catch (error) {}

// ------------------------------------------------------------
// 9. Choose Runnable Dynamically
console.log("\n");
console.log("9. choose runnable dynamically:");

// 📌 Choose Runnable Dynamically
const chainWithDynamicRunnable = RunnableLambda.from((x: number) => {
  if (x % 2 === 0) {
    return RunnableLambda.from(addOne);
  }
  return RunnableLambda.from(multiplyTwo);
});
console.log(await chainWithDynamicRunnable.batch([0, 1, 2, 3, 4]));

// ------------------------------------------------------------
// 10. Generate a stream of internal events
console.log("\n");
console.log("10. generate a stream of internal events:");

// 📌 Generate a stream of internal events
const runnable10 = RunnableLambda.from((x: number) => {
  return {
    foo: x,
  };
}).withConfig({
  runName: "first",
});
async function* generatorFn(x: { foo: number }) {
  for (let i = 0; i < x.foo; i++) {
    yield i.toString();
  }
}
const runnable11 = RunnableLambda.from(generatorFn).withConfig({
  runName: "second",
});
const chain = runnable10.pipe(runnable11);

console.log("streamEvents:");
for await (const event of chain.streamEvents(3, { version: "v1" })) {
  console.log(
    `event=${event.event} | name=${event.name} | data=${JSON.stringify(
      event.data
    )}`
  );
}

// ------------------------------------------------------------
// 11. Declaratively make a batched version of a runnable
console.log("\n");
console.log("11. Declaratively make a batched version of a runnable:");

// 📌 Runnable.map()
const runnable12 = RunnableLambda.from((x: number) => [...Array(x).keys()]);
const runnable13 = RunnableLambda.from((x: number) => x + 5);

const chainWithMap = runnable12.pipe(runnable13.map()); // but, map() is also deprecated🤔

await chainWithMap.invoke(3);
