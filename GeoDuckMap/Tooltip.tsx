import { Card } from "@heroui/react";

interface MapTooltipProps {
  level1?: string;
  level2?: string;
  level3?: string;
}

const MapTooltip: React.FC<MapTooltipProps> = ({ level1, level2, level3 }) => {
  return (
    <div className="absolute leaflet-bottom leaflet-left">
      <Card
        className="leaflet-control max-w-sm pointer-events-none rounded-xl"
        style={{ pointerEvents: "none" }}
      >
        <Card.Header>
          <Card.Title className="text-lg">{level3}</Card.Title>
          <Card.Description>
            {level2 && <p className="text-foreground">{level2}</p>}
            {level1 && <p className="text-sm text-foreground">{level1}</p>}
          </Card.Description>
        </Card.Header>
      </Card>
    </div>
  );
};

export default MapTooltip;
