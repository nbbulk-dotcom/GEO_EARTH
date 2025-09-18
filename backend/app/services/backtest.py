"""Backtesting service for historical volcanic eruption analysis"""

import asyncio
from datetime import datetime, timedelta
from typing import Any, Dict, List, Optional

import numpy as np
import pandas as pd
from loguru import logger

from app.core.config import settings
from app.core.historical_engine import HistoricalAnalysisEngine
from app.ml.historical_analyzer import HistoricalVolcanicAnalyzer


class VolcanicBacktestService:
    """Service for running historical volcanic eruption backtests"""

    def __init__(self):
        self.historical_engine = HistoricalAnalysisEngine()
        self.ml_analyzer = HistoricalVolcanicAnalyzer()
        
        logger.info("VolcanicBacktestService initialized")

    async def run_comprehensive_backtest(
        self, 
        start_year: int, 
        end_year: int, 
        volcano_locations: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """Run comprehensive backtest across multiple volcanoes and time periods"""
        try:
            logger.info(f"Running comprehensive backtest for {start_year}-{end_year} across {len(volcano_locations)} locations")

            backtest_results = {
                "period": f"{start_year}-{end_year}",
                "total_locations": len(volcano_locations),
                "individual_results": [],
                "aggregate_metrics": {},
                "methodology": "Stationary Earth / Moving Sun with ML validation",
                "framework_version": "BRETT VOLCANIC HISTORICAL v1.0",
            }

            location_results = []
            for i, location in enumerate(volcano_locations):
                try:
                    logger.info(f"Processing location {i+1}/{len(volcano_locations)}: {location.get('name', 'Unknown')}")
                    
                    location_result = await self._run_location_backtest(
                        start_year, end_year, location
                    )
                    location_results.append(location_result)
                    
                    backtest_results["individual_results"].append(location_result)
                    
                except Exception as e:
                    logger.error(f"Error processing location {location}: {str(e)}")
                    continue

            if location_results:
                backtest_results["aggregate_metrics"] = await self._calculate_aggregate_metrics(
                    location_results
                )

            logger.info(f"Comprehensive backtest completed for {len(location_results)} locations")
            return backtest_results

        except Exception as e:
            logger.error(f"Comprehensive backtest error: {str(e)}")
            raise

    async def _run_location_backtest(
        self, start_year: int, end_year: int, location: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Run backtest for a specific volcanic location"""
        try:
            lat = location["latitude"]
            lon = location["longitude"]
            volcano_name = location.get("name", f"Volcano_{lat}_{lon}")

            simulation_results = await self.historical_engine.simulate_historical_period(
                start_year, end_year, lat, lon
            )

            ml_results = await self.ml_analyzer.backtest_historical_period(
                start_year, end_year, {
                    "volcano_id": volcano_name,
                    "latitude": lat,
                    "longitude": lon,
                    "actual_eruptions": location.get("known_eruptions", []),
                }
            )

            location_result = {
                "volcano_name": volcano_name,
                "location": {"latitude": lat, "longitude": lon},
                "simulation_results": simulation_results,
                "ml_results": ml_results,
                "combined_accuracy": await self._calculate_combined_accuracy(
                    simulation_results, ml_results
                ),
                "prediction_quality": await self._assess_prediction_quality(
                    simulation_results, ml_results
                ),
            }

            return location_result

        except Exception as e:
            logger.error(f"Location backtest error for {location}: {str(e)}")
            raise

    async def _calculate_combined_accuracy(
        self, simulation_results: Dict, ml_results: Dict
    ) -> Dict[str, Any]:
        """Calculate combined accuracy from simulation and ML results"""
        try:
            sim_accuracy = simulation_results.get("prediction_accuracy", {}).get("overall_accuracy", 0)
            ml_accuracy = ml_results.get("accuracy", 0)

            combined_accuracy = sim_accuracy * 0.6 + ml_accuracy * 0.4

            sim_precision = simulation_results.get("prediction_accuracy", {}).get("precision", 0)
            sim_recall = simulation_results.get("prediction_accuracy", {}).get("recall", 0)
            ml_precision = ml_results.get("precision", 0)
            ml_recall = ml_results.get("recall", 0)

            combined_precision = sim_precision * 0.6 + ml_precision * 0.4
            combined_recall = sim_recall * 0.6 + ml_recall * 0.4

            if combined_precision + combined_recall > 0:
                f1_score = 2 * (combined_precision * combined_recall) / (combined_precision + combined_recall)
            else:
                f1_score = 0

            return {
                "combined_accuracy": round(combined_accuracy, 4),
                "combined_precision": round(combined_precision, 4),
                "combined_recall": round(combined_recall, 4),
                "combined_f1_score": round(f1_score, 4),
                "simulation_weight": 0.6,
                "ml_weight": 0.4,
                "individual_accuracies": {
                    "simulation": round(sim_accuracy, 4),
                    "ml": round(ml_accuracy, 4),
                },
            }

        except Exception as e:
            logger.error(f"Combined accuracy calculation error: {str(e)}")
            return {}

    async def _assess_prediction_quality(
        self, simulation_results: Dict, ml_results: Dict
    ) -> Dict[str, Any]:
        """Assess overall prediction quality"""
        try:
            interference_ratio = simulation_results.get("interference_patterns", {}).get("interference_ratio", 0)
            correlation_ratio = simulation_results.get("historical_correlation", {}).get("correlation_ratio", 0)
            ml_accuracy = ml_results.get("accuracy", 0)

            quality_score = (interference_ratio * 0.3 + correlation_ratio * 0.3 + ml_accuracy * 0.4)

            if quality_score >= 0.8:
                confidence = "high"
                reliability = "excellent"
            elif quality_score >= 0.6:
                confidence = "medium"
                reliability = "good"
            elif quality_score >= 0.4:
                confidence = "low"
                reliability = "fair"
            else:
                confidence = "very_low"
                reliability = "poor"

            sim_events = simulation_results.get("interference_patterns", {}).get("interference_events_count", 0)
            ml_predictions = ml_results.get("total_predictions", 0)
            data_consistency = min(1.0, sim_events / max(1, ml_predictions))

            return {
                "quality_score": round(quality_score, 4),
                "confidence_level": confidence,
                "reliability_rating": reliability,
                "data_consistency": round(data_consistency, 4),
                "contributing_factors": {
                    "interference_patterns": round(interference_ratio, 4),
                    "historical_correlation": round(correlation_ratio, 4),
                    "ml_performance": round(ml_accuracy, 4),
                },
                "prediction_window_days": 21,
                "framework_alignment": "BRETT methodology compliant",
            }

        except Exception as e:
            logger.error(f"Prediction quality assessment error: {str(e)}")
            return {}

    async def _calculate_aggregate_metrics(self, location_results: List[Dict]) -> Dict[str, Any]:
        """Calculate aggregate metrics across all locations"""
        try:
            if not location_results:
                return {}

            combined_accuracies = []
            combined_precisions = []
            combined_recalls = []
            combined_f1_scores = []
            quality_scores = []

            for result in location_results:
                combined_acc = result.get("combined_accuracy", {})
                quality = result.get("prediction_quality", {})

                if combined_acc:
                    combined_accuracies.append(combined_acc.get("combined_accuracy", 0))
                    combined_precisions.append(combined_acc.get("combined_precision", 0))
                    combined_recalls.append(combined_acc.get("combined_recall", 0))
                    combined_f1_scores.append(combined_acc.get("combined_f1_score", 0))

                if quality:
                    quality_scores.append(quality.get("quality_score", 0))

            aggregate_metrics = {
                "total_locations_analyzed": len(location_results),
                "average_accuracy": round(np.mean(combined_accuracies), 4) if combined_accuracies else 0,
                "accuracy_std": round(np.std(combined_accuracies), 4) if combined_accuracies else 0,
                "average_precision": round(np.mean(combined_precisions), 4) if combined_precisions else 0,
                "average_recall": round(np.mean(combined_recalls), 4) if combined_recalls else 0,
                "average_f1_score": round(np.mean(combined_f1_scores), 4) if combined_f1_scores else 0,
                "average_quality_score": round(np.mean(quality_scores), 4) if quality_scores else 0,
                "best_performing_location": self._find_best_location(location_results),
                "worst_performing_location": self._find_worst_location(location_results),
                "performance_distribution": self._analyze_performance_distribution(combined_accuracies),
            }

            avg_accuracy = aggregate_metrics["average_accuracy"]
            if avg_accuracy >= 0.8:
                system_rating = "excellent"
            elif avg_accuracy >= 0.6:
                system_rating = "good"
            elif avg_accuracy >= 0.4:
                system_rating = "fair"
            else:
                system_rating = "needs_improvement"

            aggregate_metrics["overall_system_rating"] = system_rating

            return aggregate_metrics

        except Exception as e:
            logger.error(f"Aggregate metrics calculation error: {str(e)}")
            return {}

    def _find_best_location(self, location_results: List[Dict]) -> Dict[str, Any]:
        """Find best performing location"""
        if not location_results:
            return {}

        best_location = max(
            location_results,
            key=lambda x: x.get("combined_accuracy", {}).get("combined_accuracy", 0)
        )

        return {
            "volcano_name": best_location.get("volcano_name", "Unknown"),
            "location": best_location.get("location", {}),
            "accuracy": best_location.get("combined_accuracy", {}).get("combined_accuracy", 0),
        }

    def _find_worst_location(self, location_results: List[Dict]) -> Dict[str, Any]:
        """Find worst performing location"""
        if not location_results:
            return {}

        worst_location = min(
            location_results,
            key=lambda x: x.get("combined_accuracy", {}).get("combined_accuracy", 0)
        )

        return {
            "volcano_name": worst_location.get("volcano_name", "Unknown"),
            "location": worst_location.get("location", {}),
            "accuracy": worst_location.get("combined_accuracy", {}).get("combined_accuracy", 0),
        }

    def _analyze_performance_distribution(self, accuracies: List[float]) -> Dict[str, Any]:
        """Analyze performance distribution across locations"""
        if not accuracies:
            return {}

        return {
            "min_accuracy": round(min(accuracies), 4),
            "max_accuracy": round(max(accuracies), 4),
            "median_accuracy": round(np.median(accuracies), 4),
            "q1_accuracy": round(np.percentile(accuracies, 25), 4),
            "q3_accuracy": round(np.percentile(accuracies, 75), 4),
            "high_performers": len([a for a in accuracies if a >= 0.8]),
            "medium_performers": len([a for a in accuracies if 0.6 <= a < 0.8]),
            "low_performers": len([a for a in accuracies if a < 0.6]),
        }

    async def run_kilauea_validation_backtest(self) -> Dict[str, Any]:
        """Run specific validation backtest on Kīlauea data (1955-2023)"""
        try:
            logger.info("Running Kīlauea validation backtest (1955-2023)")

            kilauea_location = {
                "name": "Kīlauea",
                "latitude": 19.4069,
                "longitude": -155.2834,
                "known_eruptions": [
                    {"date": "1955-02-28", "vei": 0},
                    {"date": "1959-11-14", "vei": 2},
                    {"date": "1960-01-13", "vei": 2},
                    {"date": "1961-09-22", "vei": 0},
                    {"date": "1963-10-05", "vei": 0},
                    {"date": "1965-12-24", "vei": 0},
                    {"date": "1967-11-05", "vei": 0},
                    {"date": "1968-08-22", "vei": 0},
                    {"date": "1969-02-22", "vei": 0},
                    {"date": "1971-09-24", "vei": 0},
                    {"date": "1972-02-04", "vei": 0},
                    {"date": "1973-05-05", "vei": 0},
                    {"date": "1974-07-19", "vei": 0},
                    {"date": "1975-07-19", "vei": 0},
                    {"date": "1977-09-13", "vei": 0},
                    {"date": "1983-01-03", "vei": 0},  # Start of Pu'u 'Ō'ō eruption
                    {"date": "2018-05-03", "vei": 0},  # Lower Puna eruption
                ],
            }

            validation_result = await self._run_location_backtest(
                1955, 2023, kilauea_location
            )

            validation_result["validation_type"] = "Kīlauea Historical Validation"
            validation_result["validation_period"] = "1955-2023"
            validation_result["known_eruptions_count"] = len(kilauea_location["known_eruptions"])
            validation_result["validation_status"] = "completed"

            logger.info("Kīlauea validation backtest completed")
            return validation_result

        except Exception as e:
            logger.error(f"Kīlauea validation backtest error: {str(e)}")
            raise
