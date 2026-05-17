// src/components/public/services/ServicesSection.tsx
import { useState, useEffect } from "react";
import ProjectCard from "../../common/cards/ProjectCard";
import axios from "../../../api/axios";

interface Service {
  type: string;
  scopeOfWork: string[];
}

interface Project {
  id: number;
  categoryName: string;
  name: string;
  description: string;
  services: Service[];
}

export default function ServicesSection() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);

  useEffect(() => {
  const fetchServices = async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. get all services
      const listRes = await axios.get("/services");
      const list: any[] = listRes.data;

      // 2. fetch details for each in parallel
      const detailed = await Promise.all(
        list.map(s => axios.get(`/services/${s.id}/details`))
      );
      // 3. map to ProjectCard shape
      const mapped: Project[] = detailed.map(res => {
        const d = res.data;
        return {
          id:           d.id,
          name:         d.name,
          description:  d.description,
          categoryName: d.categoryName,
          services: (d.scopes ?? []).map((scope: any) => ({
            type: scope.title,
            scopeOfWork: (scope.cases ?? []).flatMap((c: any) =>
              (c.items ?? []).map((item: any) => item.content)
            ),
          })),
        };
      });

      setProjects(mapped);
    } catch (err: any) {
      setError(`Failed to fetch services: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  fetchServices();
}, []);
  
  return (
    <section style={{
      background: "#f8f9fa",
      padding: "5rem 0",
    }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 2rem" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h2 style={{
            fontSize: "2.5rem", fontWeight: 800,
            color: "#1a1a1a", marginBottom: "0.5rem",
          }}>Our Services</h2>
          <p style={{ fontSize: "1.2rem", color: "#666" }}>
            Professional repair and maintenance for all your equipment
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: "center", padding: "3rem", fontSize: "1.1rem", color: "#666" }}>
            Loading services...
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div style={{ textAlign: "center", padding: "3rem", fontSize: "1.1rem", color: "#dc3545" }}>
            {error}
          </div>
        )}

        {/* Grid */}
        {!loading && !error && (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "2rem",
          }}
            className="services-grid"
          >
            {projects.map(project => (
              <ProjectCard
                key={project.id}
                category={project.categoryName} // ← categoryName
                name={project.name}
                description={project.description}
                services={project.services}                   // ← stops the crash for now
              />
            ))}
          </div>
        )}
      </div>
      

      <style>{`
        @media (max-width: 1024px) { .services-grid { grid-template-columns: 1fr !important; } }
        @media (max-width: 768px)  { .services-grid { gap: 1.5rem !important; } }
      `}</style>
    </section>
  );
}