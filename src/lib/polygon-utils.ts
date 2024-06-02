import {
	ABOVE,
	BELOW,
	Direction,
	LEFT,
	Label,
	Polygon,
	RIGHT,
	Row,
} from "./types";

export function isInTargetRange(
	polygon: Polygon,
	anchor: Polygon,
	configuration: Label | Row,
): boolean {
	const { position } = configuration;
	return (
		isOnTargetSideOfAnchor(
			getAdjacentEdge(polygon, position),
			getAnchorEdge(anchor, position),
			configuration.position,
		) && alignsWithAnchor(polygon, anchor, configuration)
	);
}

export function isCloserToAnchorThanPrev(
	currentEdge: number,
	prevEdge: number,
	position: Direction,
): boolean {
	switch (position) {
		case RIGHT:
			return currentEdge < prevEdge;
		case LEFT:
			return currentEdge > prevEdge;
		case BELOW:
			return currentEdge < prevEdge;
		case ABOVE:
			return currentEdge > prevEdge;
	}
}

export function getAnchorEdge(polygon: Polygon, position: Direction): number {
	switch (position) {
		case RIGHT:
			return getRightmostPoint(polygon);
		case LEFT:
			return getLeftmostPoint(polygon);
		case BELOW:
			return getBottomPoint(polygon);
		case ABOVE:
			return getTopPoint(polygon);
	}
}

export function getAdjacentEdge(polygon: Polygon, position: Direction): number {
	switch (position) {
		case RIGHT:
			return getLeftmostPoint(polygon);
		case LEFT:
			return getRightmostPoint(polygon);
		case BELOW:
			return getTopPoint(polygon);
		case ABOVE:
			return getBottomPoint(polygon);
	}
}

function alignsWithAnchor(
	polygon: Polygon,
	anchor: Polygon,
	configuration: Label | Row,
) {
	if (configuration.position === ABOVE || configuration.position === BELOW) {
		return alignsWithHorizontalAnchorPoint(
			polygon,
			getAnchorEdge(anchor, configuration.textAlignment),
		);
	}
	return alignsVerticallyWithAnchor(polygon, anchor);
}

function isOnTargetSideOfAnchor(
	lineEdge: number,
	anchorEdge: number,
	position: Direction,
): boolean {
	switch (position) {
		case RIGHT:
			return lineEdge >= anchorEdge;
		case LEFT:
			return lineEdge <= anchorEdge;
		case BELOW:
			return lineEdge >= anchorEdge;
		case ABOVE:
			return lineEdge <= anchorEdge;
	}
}

function alignsWithHorizontalAnchorPoint(
	polygon: Polygon,
	alignmentPoint: number,
): boolean {
	const polygonLeft = getLeftmostPoint(polygon);
	const polygonRight = getRightmostPoint(polygon);
	return alignmentPoint >= polygonLeft && alignmentPoint <= polygonRight;
}

function alignsVerticallyWithAnchor(
	polygon: Polygon,
	anchor: Polygon,
): boolean {
	const polygonTop = getTopPoint(polygon);
	const polygonBottom = getBottomPoint(polygon);
	const anchorTop = getTopPoint(anchor);
	const anchorBottom = getBottomPoint(anchor);

	const bottomBelowAnchorTop = polygonBottom >= anchorTop;
	const topAboveAnchorBottom = polygonTop <= anchorBottom;
	const topBelowAnchorTop = polygonTop >= anchorTop;
	const bottomAboveAnchorBottom = polygonBottom <= anchorBottom;

	return (
		(topAboveAnchorBottom && topBelowAnchorTop) ||
		(bottomBelowAnchorTop && bottomAboveAnchorBottom)
	);
}

function getRightmostPoint(polygon: Polygon): number {
	return Math.max(polygon[1].x, polygon[2].x);
}

function getLeftmostPoint(polygon: Polygon): number {
	return Math.min(polygon[0].x, polygon[3].x);
}

function getTopPoint(polygon: Polygon): number {
	return Math.min(polygon[0].y, polygon[1].y);
}

function getBottomPoint(polygon: Polygon): number {
	return Math.max(polygon[3].y, polygon[2].y);
}
