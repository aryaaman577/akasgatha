/**
 * RAG Retrieval Benchmark & Quality Evaluation Script
 * 
 * Evaluates retrieval performance across question-bank.json.
 * Computes Top-1 Recall, Top-3 Recall, MRR, False Positive Rate, Latencies, Memory.
 * 
 * Usage: npm run rag:eval
 */

import * as fs from "fs/promises";
import * as path from "path";
import { queryIndex } from "../../src/lib/server/rag/local-index";
import type { EvaluationCase } from "./generate-question-bank";

async function main() {
  console.log("======================================================================");
  console.log("AKASGATHA RAG RETRIEVAL QUALITY BENCHMARK");
  console.log("======================================================================");
  console.log();

  const bankPath = path.join(process.cwd(), "data", "question-bank.json");
  const bankData = await fs.readFile(bankPath, "utf-8");
  const cases: EvaluationCase[] = JSON.parse(bankData);

  console.log(`Loaded ${cases.length} evaluation cases from question-bank.json`);
  console.log();

  const memBefore = process.memoryUsage().heapUsed;
  const latencies: number[] = [];

  let top1Hits = 0;
  let top3Hits = 0;
  let mrrSum = 0;
  let falsePositives = 0;
  let outOfScopeCount = 0;
  let outOfScopeSuppressed = 0;
  let totalEvaluated = 0;

  for (const c of cases) {
    if (c.domain === "out-of-scope") {
      outOfScopeCount++;
      const res = await queryIndex(c.question, { topK: 3 });
      if (res.length === 0) {
        outOfScopeSuppressed++;
      } else {
        falsePositives++;
      }
      continue;
    }

    totalEvaluated++;
    const t0 = performance.now();
    const results = await queryIndex(c.question, { topK: 3 });
    const t1 = performance.now();
    latencies.push(t1 - t0);

    let hitRank = 0;
    for (let i = 0; i < results.length; i++) {
      const entry = results[i].entry;
      const contentLower = entry.chunk.content.toLowerCase();
      const titleLower = entry.chunk.documentTitle.toLowerCase();
      const topicLower = entry.chunk.topic.toLowerCase();

      // Check hit criteria: keyword overlap OR topic alignment
      const keyPointsMatched = c.requiredKeyPoints.some(kp => {
        const kpWords = kp.toLowerCase().split(/[\s,()/-]+/).filter(w => w.length > 2);
        if (kpWords.length === 0) return false;
        const matchedWords = kpWords.filter(w => contentLower.includes(w) || titleLower.includes(w) || topicLower.includes(w));
        return (matchedWords.length / kpWords.length) >= 0.25;
      }) || (c.domain.toLowerCase().includes(entry.chunk.domain.toLowerCase()) && (titleLower.includes(c.domain) || topicLower.includes(c.domain)));

      if (keyPointsMatched) {
        hitRank = i + 1;
        break;
      }
    }

    if (hitRank === 1) {
      top1Hits++;
      top3Hits++;
      mrrSum += 1.0;
    } else if (hitRank === 2) {
      top3Hits++;
      mrrSum += 0.5;
    } else if (hitRank === 3) {
      top3Hits++;
      mrrSum += 0.333;
    }
  }

  const memAfter = process.memoryUsage().heapUsed;
  const heapDeltaMB = ((memAfter - memBefore) / (1024 * 1024)).toFixed(2);

  // Compute Latency Percentiles
  latencies.sort((a, b) => a - b);
  const p50 = latencies[Math.floor(latencies.length * 0.50)]?.toFixed(2) || "0";
  const p95 = latencies[Math.floor(latencies.length * 0.95)]?.toFixed(2) || "0";
  const p99 = latencies[Math.floor(latencies.length * 0.99)]?.toFixed(2) || "0";

  const top1RecallPct = ((top1Hits / totalEvaluated) * 100).toFixed(1);
  const top3RecallPct = ((top3Hits / totalEvaluated) * 100).toFixed(1);
  const mrrScore = (mrrSum / totalEvaluated).toFixed(3);
  const suppressionRatePct = outOfScopeCount > 0 ? ((outOfScopeSuppressed / outOfScopeCount) * 100).toFixed(1) : "100.0";

  console.log("BENCHMARK METRICS SUMMARY:");
  console.log(`  Evaluated In-Scope Questions : ${totalEvaluated}`);
  console.log(`  Evaluated Out-Of-Scope Cases : ${outOfScopeCount}`);
  console.log(`  Top-1 Recall                : ${top1RecallPct}% (${top1Hits}/${totalEvaluated})`);
  console.log(`  Top-3 Recall                : ${top3RecallPct}% (${top3Hits}/${totalEvaluated})`);
  console.log(`  Mean Reciprocal Rank (MRR)  : ${mrrScore}`);
  console.log(`  False Positive Suppression  : ${suppressionRatePct}% (${outOfScopeSuppressed}/${outOfScopeCount} suppressed)`);
  console.log(`  Latency P50 / P95 / P99     : ${p50} ms / ${p95} ms / ${p99} ms`);
  console.log(`  Heap Memory Delta           : ${heapDeltaMB} MB`);
  console.log();

  const top1Pass = parseFloat(top1RecallPct) >= 90.0;
  const top3Pass = parseFloat(top3RecallPct) >= 95.0;

  if (top1Pass && top3Pass) {
    console.log("======================================================================");
    console.log("RAG BENCHMARK PASSED ✓ (Top-1 >= 90%, Top-3 >= 95%)");
    console.log("======================================================================");
  } else {
    console.warn("======================================================================");
    console.warn("⚠️  RAG BENCHMARK WARN (Targeting Top-1 >= 90%, Top-3 >= 95%)");
    console.warn("======================================================================");
  }
}

main().catch((err) => {
  console.error("❌ Benchmark failed:", err);
  process.exit(1);
});
