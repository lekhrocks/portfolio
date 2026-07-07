"use client";

import {
  Band, Datastore, DiagramFrame, External, FlowArrow, Gateway, Queue, Service,
} from "./primitives";

export type DiagramMode = "topology" | "query" | "ingest";

const H = 540;

const dimFn = (mode: DiagramMode, path: string[], id: string) => {
  if (mode === "topology") return false;
  if (mode === "query") return !["gw","auth","chat","ret","llm","intent","pgs","neo","pgv"].includes(id);
  if (mode === "ingest") return !["src","kafka","ing","chunk","emb","wr","vdb","grf"].includes(id);
  return false;
};

export default function EkaDiagram({ mode = "topology" }: { mode?: DiagramMode; playKey?: number }) {
  const dim = (id: string) => dimFn(mode, [], id);
  const de = (...ids: string[]) => (mode === "topology" ? false : ids.some(dim));

  return (
    <DiagramFrame viewBox="0 0 1200 600" height={600}>
      {/* ═══════ Row 1: Client → Gateway → Auth ═══════ */}
      <Band x={0} y={0} width={1200} height={90} label="Client + ingress" />

      <Service x={50} y={24} w={160} label="EKA UI" sublabel="Next.js 16" dim={dim("gw")} />
      <Gateway x={300} y={24} w={170} label="API Gateway" sublabel="Spring Cloud Gateway" dim={dim("gw")} />
      <FlowArrow x1={210} y1={44} x2={300} y2={44} label="requests" step={1} dim={de("gw")} />
      <FlowArrow x1={50} y1={74} x2={300} y2={74} dim={de("gw")} /> {/* OAuth2 */}

      <Service x={550} y={24} w={160} h={54} label="JWT Auth" sublabel="OAuth2 / Email" dim={dim("auth")} />
      <FlowArrow x1={470} y1={44} x2={550} y2={44} label="route + auth" step={2} dim={de("gw","auth")} />

      <Datastore x={790} y={30} w={120} h={50} label="Redis" sublabel="token blacklist" dim={dim("auth")} />
      <FlowArrow x1={710} y1={50} x2={790} y2={50} dim={de("auth")} />

      {/* ═══════ Row 2: Query path (left band) ═══════ */}
      <Band x={0} y={110} width={590} height={310} label="Query path" dim={dim("chat")} />

      {/* Sub-row inside query band */}
      <Service x={40} y={130} w={170} label="Chat Service" sublabel="RAG pipeline + context" dim={dim("chat")} />
      <FlowArrow x1={385} y1={90} x2={125} y2={130} label="chat" step={3} dim={de("auth","chat")} />

      <Service x={250} y={130} w={170} label="Retrieval" sublabel="Hybrid + Cohere rerank" dim={dim("ret")} />
      <FlowArrow x1={210} y1={150} x2={250} y2={150} label="retrieve" step={4} dim={de("chat","ret")} />

      <Datastore x={460} y={130} w={120} h={50} label="pgvector" sublabel="vector index" dim={dim("pgv")} />
      <FlowArrow x1={420} y1={150} x2={460} y2={150} label="vector" dim={de("ret","pgv")} />

      <Service x={40} y={240} w={170} label="Intent Detector" sublabel="LLM routing" dim={dim("intent")} />
      <FlowArrow x1={125} y1={200} x2={125} y2={240} dim={de("chat","intent")} />

      <Service x={250} y={240} w={170} h={54} label="LLM Router" sublabel="Anthropic / OpenAI" dim={dim("llm")} />
      <FlowArrow x1={210} y1={260} x2={250} y2={260} label="stream" step={5} dim={de("intent","llm")} />

      <Datastore x={460} y={235} w={120} h={50} label="PostgreSQL" sublabel="metadata + users" dim={dim("pgs")} />
      <FlowArrow x1={420} y1={180} x2={460} y2={255} label="metadata" dim={de("ret","pgs")} />

      <Datastore x={460} y={340} w={120} h={50} label="Neo4j" sublabel="knowledge graph" dim={dim("neo")} />
      <FlowArrow x1={420} y1={210} x2={460} y2={355} label="graph" dim={de("ret","neo")} />

      {/* ═══════ Row 2: Ingestion path (right band) ═══════ */}
      <Band x={610} y={110} width={590} height={310} label="Ingestion path" dim={dim("ingest")} />

      <External x={630} y={130} w={170} label="GitHub / GitLab" sublabel="code repos" dim={dim("src")} />
      <External x={630} y={200} w={170} label="Confluence" sublabel="docs" dim={dim("src")} />
      <External x={630} y={270} w={170} label="Web Crawler" sublabel="doc sites" dim={dim("src")} />

      <Queue x={860} y={130} w={170} h={50} label="Kafka" sublabel="topic + DLQ" dim={dim("kafka")} />
      <FlowArrow x1={800} y1={150} x2={860} y2={150} label="publish" dim={de("src","kafka")} />

      <Service x={860} y={220} w={170} label="Ingestion" sublabel="Kafka consumer" dim={dim("ing")} />
      <FlowArrow x1={945} y1={180} x2={945} y2={220} dim={de("kafka","ing")} />

      <Service x={630} y={360} w={170} h={50} label="Chunker" sublabel="code-aware split" dim={dim("chunk")} />
      <FlowArrow x1={860} y1={270} x2={720} y2={360} label="parse → split" dim={de("ing","chunk")} />

      <Service x={860} y={360} w={170} label="Embedder" sublabel="OpenAI / Voyage" dim={dim("emb")} />
      <FlowArrow x1={800} y1={380} x2={860} y2={380} dim={de("chunk","emb")} />

      <Service x={1050} y={360} w={140} h={50} label="Batch Writer" sublabel="multi-row upsert" dim={dim("wr")} />
      <FlowArrow x1={1030} y1={380} x2={1050} y2={380} dim={de("emb","wr")} />

      <Datastore x={1050} y={280} w={140} h={50} label="pgvector" sublabel="embedding DB" dim={dim("vdb")} />
      <FlowArrow x1={1120} y1={380} x2={1120} y2={330} dim={de("wr","vdb")} />

      <Service x={860} y={430} w={140} h={44} label="Graph Builder" sublabel="Neo4j entities" dim={dim("grf")} />
      <FlowArrow x1={1000} y1={400} x2={930} y2={430} dim={de("wr","grf")} />

      {/* ═══════ Row 3: Observability ═══════ */}
      <Band x={0} y={480} width={1200} height={100} label="Observability" />

      <External x={50} y={500} w={200} label="Prometheus / Grafana" sublabel="metrics + distributed tracing" dim={dim("observability")} />
      <FlowArrow x1={250} y1={525} x2={320} y2={525} label="metrics + OTEL spans" dim={de("observability")} />
    </DiagramFrame>
  );
}
