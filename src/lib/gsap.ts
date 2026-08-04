import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

/**
 * Módulo único de registro de plugins (FASE-04, tarea GSAP #1). Se importa
 * solo desde componentes cliente; gsap.registerPlugin() es seguro en SSR
 * (no toca window/document hasta que se crea una animación real).
 * SplitText es gratis desde GSAP 3.13 (adquisición de Webflow), sin cuenta
 * de Club GSAP ni token — ver skill gsap-plugins.
 */
gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

export { gsap, ScrollTrigger, SplitText, useGSAP };
