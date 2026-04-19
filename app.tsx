import { useState } from "react";
import "./styles.css";

type ProjectType = "Residencial" | "Comercial" | "Industrial";

const sizeOptions: Record<ProjectType, string[]> = {
  Residencial: ["3 kW", "5 kW", "10 kW", "15 kW"],
  Comercial: ["20 kW", "50 kW", "100 kW", "250 kW", "500 kW"],
  Industrial: ["100 kW", "250 kW", "500 kW", "1 MW", "2.5 MW+"],
};

function parsePowerToKW(value: string): number {
  if (value.includes("2.5 MW")) return 2500;
  if (value.includes("1 MW")) return 1000;
  return parseFloat(value.replace(" kW", ""));
}

export default function App() {
  const [projectType, setProjectType] = useState<ProjectType>("Residencial");
  const [systemSize, setSystemSize] = useState("5 kW");
  const [location, setLocation] = useState("Ciudad de Panamá");
  const [gridConnection, setGridConnection] = useState("Sí");
  const [result, setResult] = useState("");
  const [recommendation, setRecommendation] = useState(
    "Validar capacidad de red antes de dimensionar el sistema."
  );
  const [riskItems, setRiskItems] = useState([
    {
      title: "Retrasos en interconexión",
      body: "Posibles demoras en la conexión a la red.",
    },
    {
      title: "Alta Carga Administrativa",
      body: "Elevada cantidad de trámites y documentación.",
    },
  ]);

  const handleProjectTypeChange = (value: ProjectType) => {
    setProjectType(value);
    setSystemSize(sizeOptions[value][0]);
    setResult("");
  };

  const evaluate = () => {
    const sizeKW = parsePowerToKW(systemSize);

    let complexity = "Baja";
    let color = "🟢";
    let message = "";

    const risks: { title: string; body: string }[] = [];
    let recommendationText =
      "Validar capacidad de red antes de dimensionar el sistema.";

    // Complejidad principal
    if (sizeKW > 2500) {
      complexity = "Muy Alta";
      color = "🔴";
    } else if (sizeKW > 500) {
      complexity = "Alta";
      color = "🔴";
    } else if (projectType !== "Residencial" || sizeKW >= 20) {
      complexity = "Media";
      color = "🟡";
    }

    message = `${color} Complejidad: ${complexity}.\n`;

    // Perfil por tipo de proyecto
    if (projectType === "Residencial") {
      message +=
        "Proyecto de autoconsumo residencial con complejidad operativa relativamente baja y enfoque en ahorro directo del usuario.\n";

      risks.push({
        title: "Dimensionamiento inadecuado",
        body: "Un sistema sobredimensionado o subdimensionado puede afectar el retorno económico esperado.",
      });
    }

    if (projectType === "Comercial") {
      message +=
        "Proyecto comercial: requiere análisis del perfil de demanda, optimización energética y evaluación del impacto en facturación eléctrica.\n";

      risks.push({
        title: "Perfil de demanda mal caracterizado",
        body: "Una mala estimación de la demanda puede reducir la eficiencia económica del proyecto.",
      });
    }

    if (projectType === "Industrial") {
      message +=
        "Proyecto industrial: implica mayor impacto en la red y suele requerir análisis técnico más detallado desde etapas tempranas.\n";

      risks.push({
        title: "Impacto técnico en la red",
        body: "El proyecto puede requerir revisión más rigurosa del punto de conexión y de las condiciones operativas.",
      });
    }

    // Escala regulatoria y técnica
    if (sizeKW <= 500) {
      message +=
        "Escala preliminar compatible con el primer nivel regulatorio de referencia para autoconsumo.\n";
    }

    if (sizeKW > 500 && sizeKW <= 2500) {
      message +=
        "Proyecto de escala alta: implica mayores exigencias técnicas, operativas y de supervisión respecto a proyectos menores.\n";

      risks.push({
        title: "Mayor exigencia técnica",
        body: "A partir de esta escala pueden aumentar los requerimientos de validación, supervisión y coordinación técnica.",
      });
    }

    if (sizeKW > 2500) {
      message +=
        "Proyecto de gran escala: requiere evaluación técnica avanzada, revisión regulatoria más estricta y mayor atención al proceso de interconexión.\n";

      risks.push({
        title: "Complejidad regulatoria elevada",
        body: "El proyecto puede requerir análisis más avanzados y una coordinación institucional más robusta.",
      });
    }

    // Conexión a red
    if (gridConnection === "Sí") {
      message +=
        "Requiere interconexión con la red y validación del punto de conexión antes del cierre del diseño.\n";

      risks.push({
        title: "Retrasos en interconexión",
        body: "Pueden presentarse demoras asociadas a revisión técnica, validación del punto de conexión o coordinación con la red.",
      });

      if (sizeKW <= 15 && projectType === "Residencial") {
        recommendationText =
          "Validar capacidad de red y ajustar el sistema al perfil de consumo antes de cerrar el diseño.";
      } else if (sizeKW <= 500) {
        recommendationText =
          "Validar capacidad de red, revisar perfil de demanda y optimizar el dimensionamiento antes de tramitar el proyecto.";
      } else {
        recommendationText =
          "Realizar una prefactibilidad técnico-regulatoria e iniciar validación de interconexión antes de definir el alcance final del proyecto.";
      }
    } else {
      message +=
        "Sistema aislado: debe evaluarse con especial atención el almacenamiento energético, la continuidad operativa y la estrategia de respaldo.\n";

      risks.push({
        title: "Dependencia del almacenamiento",
        body: "La continuidad del suministro dependerá del diseño del respaldo energético y de la estrategia operacional.",
      });

      recommendationText =
        "Priorizar almacenamiento, continuidad operativa y estrategia de respaldo antes de cerrar el diseño del sistema.";
    }

    // Ubicación
    if (location === "Ciudad de Panamá") {
      message +=
        "Debe revisarse además la ruta documental y los requisitos municipales aplicables en la Ciudad de Panamá.\n";

      risks.push({
        title: "Carga administrativa",
        body: "El proyecto puede requerir mayor preparación documental y revisión de requisitos municipales.",
      });
    }

    // Recomendación final del bloque de resultado
    message += `Recomendación principal: ${recommendationText}`;

    // Limitar a dos riesgos más relevantes para mantener limpio el diseño
    const prioritizedRisks = risks.slice(0, 2);

    setResult(message);
    setRecommendation(recommendationText);
    setRiskItems(prioritizedRisks);
  };

  return (
    <div className="page">
      <header className="topbar">
        <div className="brand">
          <div className="brand-icon">☀️</div>
          <div className="brand-text">
            <span className="brand-strong">SolarFlow</span>
            <span className="brand-light"> PTY</span>
          </div>
        </div>

        <button className="login-btn" type="button">
          Iniciar Sesión
        </button>
      </header>

      <main className="content">
        <section className="panel">
          <h1 className="main-title">Evaluador de Proyecto Solar</h1>
          <p className="main-subtitle">
            Evalúa rápidamente tu proyecto fotovoltaico en Panamá.
          </p>

          <div className="section-divider" />

          <div className="form-grid">
            <div className="field">
              <label>Tipo de Proyecto</label>
              <select
                value={projectType}
                onChange={(e) =>
                  handleProjectTypeChange(e.target.value as ProjectType)
                }
              >
                <option>Residencial</option>
                <option>Comercial</option>
                <option>Industrial</option>
              </select>
            </div>

            <div className="field">
              <label>Tamaño del Sistema</label>
              <select
                value={systemSize}
                onChange={(e) => setSystemSize(e.target.value)}
              >
                {sizeOptions[projectType].map((size) => (
                  <option key={size}>{size}</option>
                ))}
              </select>
            </div>

            <div className="field">
              <label>Ubicación</label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              >
                <option>Ciudad de Panamá</option>
                <option>Otra</option>
              </select>
            </div>

            <div className="field">
              <label>Conexión a Red</label>
              <select
                value={gridConnection}
                onChange={(e) => setGridConnection(e.target.value)}
              >
                <option>Sí</option>
                <option>No</option>
              </select>
            </div>
          </div>

          <div className="center-row">
            <button className="evaluate-btn" onClick={evaluate}>
              Evaluar Proyecto
            </button>
          </div>
        </section>

        <section className="panel">
          <h2 className="section-title">Proceso</h2>
          <p className="section-subtitle">
            Pasos para implementar tu sistema solar.
          </p>

          <div className="section-divider" />

          <div className="process-row">
            <div className="process-item">
              <div className="process-icon">📐</div>
              <div className="process-label">Diseño</div>
            </div>

            <div className="process-arrow">→</div>

            <div className="process-item">
              <div className="process-icon">📋</div>
              <div className="process-label">Permisos</div>
            </div>

            <div className="process-arrow">→</div>

            <div className="process-item">
              <div className="process-icon">⚡</div>
              <div className="process-label">Interconexión</div>
            </div>

            <div className="process-arrow">→</div>

            <div className="process-item">
              <div className="process-icon">🔋</div>
              <div className="process-label">Instalación</div>
            </div>
          </div>
        </section>

        <section className="panel">
          <h2 className="section-title">Riesgos del Proyecto</h2>

          <div className="section-divider" />

          <div className="risk-grid">
            {riskItems.map((risk, index) => (
              <div className="risk-card" key={index}>
                <div className="risk-head">⚠️ {risk.title}</div>
                <div className="risk-body">{risk.body}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="panel">
          <h2 className="section-title">Recomendación</h2>

          <div className="section-divider" />

          <div className="recommend-box">{recommendation}</div>
        </section>

        {result && (
          <section className="panel">
            <h2 className="section-title left-title">Resultado Preliminar</h2>
            <div className="result-box">
              {result.split("\n").map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
