#!/bin/bash
#
# load_erp.sh - Load all ERP Foundation apps in dependency order
#
# Usage: ./load_erp.sh [--validate-only] [--skip-base] [--layer <0|1|2|all>]
#
# Load order respects the dependency graph:
#   1. erp_base/app_erp_base          (org, tenant, shared users, erp-goal)
#   2. erp_base/ Layer 0 apps        (org, coa, fiscal, party, resource, location)
#   3. erp_base/ Layer 1 apps        (budget)
#   4. erp_base/ Layer 2 apps        (okr)
#   5. erp_apps/ Layer 2 apps        (procurement)
#   6. app_erp_integration            (cross-app relators) — future
#
# Options:
#   --validate-only    Only validate, do not load to broker
#   --skip-base        Skip app_erp_base (already loaded)
#   --layer <n|all>    Only load specific layer (0, 1, 2, or all)
#   --dry-run          Show load order without executing
#

set -e

# ─── Configuration ───────────────────────────────────────────────────────────

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
CLI_DIR="$(cd "$SCRIPT_DIR/../../model1-admin-cli" && pwd)"
CLI_BIN="$CLI_DIR/target/release/model1-cli"
CERT_PATH="$SCRIPT_DIR/../../broker/certs/cert.pem"
FOUNDATION_PATH="$SCRIPT_DIR/../../broker/bootstrap/1_foundation/metadata_app.json"

# ─── Colors ──────────────────────────────────────────────────────────────────

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
DIM='\033[2m'
NC='\033[0m'

# ─── Parse Arguments ────────────────────────────────────────────────────────

VALIDATE_ONLY=false
SKIP_BASE=false
LAYER="all"
DRY_RUN=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --validate-only)
            VALIDATE_ONLY=true
            shift
            ;;
        --skip-base)
            SKIP_BASE=true
            shift
            ;;
        --layer)
            LAYER="$2"
            shift 2
            ;;
        --dry-run)
            DRY_RUN=true
            shift
            ;;
        -h|--help)
            echo "Usage: $0 [--validate-only] [--skip-base] [--layer <0|1|2|all>] [--dry-run]"
            echo ""
            echo "Load all ERP Foundation apps in dependency order."
            echo ""
            echo "Options:"
            echo "  --validate-only    Only validate files, do not load to broker"
            echo "  --skip-base        Skip app_erp_base (already loaded)"
            echo "  --layer <n|all>    Only load specific layer: 0, 1, 2, or all (default: all)"
            echo "  --dry-run          Show load order without executing"
            echo "  -h, --help         Show this help message"
            echo ""
            echo "Load order:"
            echo "  erp_base/"
            echo "  1. app_erp_base             (shared infrastructure)"
            echo "  2. app_erp_org              (Layer 0)"
            echo "  3. app_erp_chart_of_accounts (Layer 0)"
            echo "  4. app_erp_fiscal_calendar   (Layer 0)"
            echo "  5. app_erp_party            (Layer 0)"
            echo "  6. app_erp_resource         (Layer 0)"
            echo "  7. app_erp_location         (Layer 0)"
            echo "  8. app_erp_budget           (Layer 1)"
            echo "  9. app_erp_okr              (Layer 2)"
            echo ""
            echo "  erp_apps/"
            echo " 10. app_erp_procurement      (Layer 2)"
            exit 0
            ;;
        *)
            echo -e "${RED}Unknown option: $1${NC}"
            echo "Use --help for usage information."
            exit 1
            ;;
    esac
done

# ─── Verify Prerequisites ───────────────────────────────────────────────────

if [ ! -f "$CLI_BIN" ]; then
    echo -e "${RED}Error: CLI binary not found at $CLI_BIN${NC}"
    echo "Build it with: cd model1-admin-cli && cargo build --release"
    exit 1
fi

if [ "$VALIDATE_ONLY" = false ] && [ "$DRY_RUN" = false ]; then
    if [ ! -f "$CERT_PATH" ]; then
        echo -e "${RED}Error: TLS certificate not found at $CERT_PATH${NC}"
        echo "Generate with: cd broker && ./generate_certs.sh"
        exit 1
    fi
fi

if [ ! -f "$FOUNDATION_PATH" ]; then
    echo -e "${RED}Error: Foundation metadata not found at $FOUNDATION_PATH${NC}"
    exit 1
fi

# ─── Define Load Order ──────────────────────────────────────────────────────

# Each entry: "layer:directory_path:description"
declare -a LOAD_ORDER=(
    "base:erp_base/app_erp_base:Shared Infrastructure (org, tenant, users, erp-goal)"
    "0:erp_base/app_erp_org:Organizational Structure"
    "0:erp_base/app_erp_chart_of_accounts:Chart of Accounts"
    "0:erp_base/app_erp_fiscal_calendar:Fiscal Calendar"
    "0:erp_base/app_erp_party:Party Master"
    "0:erp_base/app_erp_resource:Resource Catalog"
    "0:erp_base/app_erp_location:Location Master"
    "1:erp_base/app_erp_budget:Budgeting"
    "2:erp_base/app_erp_okr:OKR / Goals"
    "2:erp_apps/app_erp_procurement:Procurement Requisitions"
)

# ─── Filter by Layer ────────────────────────────────────────────────────────

declare -a FILTERED_ORDER=()
for entry in "${LOAD_ORDER[@]}"; do
    IFS=':' read -r layer dir desc <<< "$entry"

    # Skip base if requested
    if [ "$layer" = "base" ] && [ "$SKIP_BASE" = true ]; then
        continue
    fi

    # Filter by layer
    if [ "$LAYER" != "all" ]; then
        if [ "$layer" = "base" ]; then
            # Base always loads unless --skip-base
            FILTERED_ORDER+=("$entry")
        elif [ "$layer" = "$LAYER" ]; then
            FILTERED_ORDER+=("$entry")
        fi
    else
        FILTERED_ORDER+=("$entry")
    fi
done

TOTAL=${#FILTERED_ORDER[@]}

if [ $TOTAL -eq 0 ]; then
    echo -e "${YELLOW}No apps to load for layer=$LAYER${NC}"
    exit 0
fi

# ─── Display Plan ────────────────────────────────────────────────────────────

MODE="LOAD"
if [ "$VALIDATE_ONLY" = true ]; then
    MODE="VALIDATE"
fi
if [ "$DRY_RUN" = true ]; then
    MODE="DRY RUN"
fi

echo ""
echo -e "${BOLD}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BOLD}║          ERP Foundations — ${MODE} Sequence                  ║${NC}"
echo -e "${BOLD}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""

STEP=0
for entry in "${FILTERED_ORDER[@]}"; do
    IFS=':' read -r layer dir desc <<< "$entry"
    STEP=$((STEP + 1))

    case $layer in
        base) badge="${CYAN}BASE${NC}" ;;
        0)    badge="${GREEN}L0${NC}" ;;
        1)    badge="${BLUE}L1${NC}" ;;
        2)    badge="${RED}L2${NC}" ;;
    esac

    data_note=""
    if [ ! -f "$SCRIPT_DIR/$dir/metadata_app_data.json" ]; then
        data_note=" ${DIM}(schema only)${NC}"
    fi

    echo -e "  ${BOLD}$STEP.${NC} [${badge}] ${dir}  ${DIM}— ${desc}${NC}${data_note}"
done
echo ""

if [ "$DRY_RUN" = true ]; then
    echo -e "${YELLOW}Dry run complete. No actions taken.${NC}"
    exit 0
fi

# ─── Execute ─────────────────────────────────────────────────────────────────

PASSED=0
FAILED=0
FAILED_NAMES=""
STEP=0

for entry in "${FILTERED_ORDER[@]}"; do
    IFS=':' read -r layer dir desc <<< "$entry"
    STEP=$((STEP + 1))
    APP_PATH="$SCRIPT_DIR/$dir"

    case $layer in
        base) badge="${CYAN}BASE${NC}" ;;
        0)    badge="${GREEN}L0${NC}" ;;
        1)    badge="${BLUE}L1${NC}" ;;
        2)    badge="${RED}L2${NC}" ;;
    esac

    echo -e "${BOLD}[$STEP/$TOTAL]${NC} [${badge}] ${dir}"

    # Check directory exists
    if [ ! -d "$APP_PATH" ]; then
        echo -e "  ${YELLOW}SKIP${NC} — directory not found"
        continue
    fi

    # Check metadata_app.json exists
    if [ ! -f "$APP_PATH/metadata_app.json" ]; then
        echo -e "  ${YELLOW}SKIP${NC} — no metadata_app.json"
        continue
    fi

    EXIT_CODE=0

    if [ "$VALIDATE_ONLY" = true ]; then
        # Validate only
        OUTPUT=$("$CLI_BIN" validate --path "$APP_PATH" --foundation "$FOUNDATION_PATH" 2>&1) || EXIT_CODE=$?
    else
        # Load to broker
        OUTPUT=$("$CLI_BIN" --cert-path "$CERT_PATH" load --dir "$APP_PATH" --progress 2>&1) || EXIT_CODE=$?
    fi

    # Show relevant output lines
    if [ $EXIT_CODE -ne 0 ]; then
        echo "$OUTPUT" | tail -10
        echo -e "  ${RED}FAIL${NC}"
        FAILED=$((FAILED + 1))
        FAILED_NAMES="$FAILED_NAMES $dir"
    else
        # Show summary line for loads
        if [ "$VALIDATE_ONLY" = true ]; then
            echo "$OUTPUT" | grep -E "VALID|valid" | head -3
        else
            echo "$OUTPUT" | grep -E "Duration:|Loaded items:" | head -2
        fi
        echo -e "  ${GREEN}PASS${NC}"
        PASSED=$((PASSED + 1))
    fi
    echo ""
done

# ─── Summary ────────────────────────────────────────────────────────────────

echo -e "${BOLD}══════════════════════════════════════════════════════════════${NC}"
if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}${BOLD}Summary: $PASSED passed, $FAILED failed${NC}"
else
    echo -e "${YELLOW}${BOLD}Summary: $PASSED passed, $FAILED failed${NC}"
    echo -e "${RED}Failed:${NC}$FAILED_NAMES"
fi
echo -e "${BOLD}══════════════════════════════════════════════════════════════${NC}"

if [ $FAILED -gt 0 ]; then
    exit 1
fi
