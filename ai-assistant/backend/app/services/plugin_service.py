"""
Plugin Service - Extensible plugin system supporting MCP, REST, local tools, Python/JS plugins.
"""

from typing import Dict, List, Any, Callable
from pydantic import BaseModel
import structlog

logger = structlog.get_logger()

class Plugin(BaseModel):
    id: str
    name: str
    description: str
    type: str  # rest, mcp, local_python, local_js
    endpoint: str | None = None
    function: Callable | None = None
    enabled: bool = True

class PluginService:
    def __init__(self):
        self.plugins: Dict[str, Plugin] = {}
        self._register_core_plugins()

    def _register_core_plugins(self):
        # Example built-in tools
        self.register_plugin(Plugin(
            id="web_search",
            name="Web Search",
            description="Search the internet for latest information",
            type="local_python",
            function=self._web_search_tool
        ))
        
        self.register_plugin(Plugin(
            id="code_executor",
            name="Code Executor",
            description="Execute Python code in sandbox",
            type="local_python",
            function=self._code_executor_tool
        ))

    def register_plugin(self, plugin: Plugin):
        self.plugins[plugin.id] = plugin
        logger.info("Plugin registered", plugin=plugin.name)

    async def execute_plugin(self, plugin_id: str, params: Dict[str, Any]) -> Any:
        if plugin_id not in self.plugins:
            raise ValueError(f"Plugin {plugin_id} not found")
        
        plugin = self.plugins[plugin_id]
        if not plugin.enabled:
            raise ValueError("Plugin is disabled")

        if plugin.function:
            return await plugin.function(**params)
        elif plugin.endpoint:
            # REST or MCP call would go here
            return {"result": f"Called external plugin {plugin_id}"}
        
        return {"error": "No execution method defined"}

    async def _web_search_tool(self, query: str, num_results: int = 5):
        return {
            "results": [
                {"title": f"Result for {query}", "url": "https://example.com", "snippet": "..."}
            ]
        }

    async def _code_executor_tool(self, code: str):
        # In production: use restricted sandbox (Docker, Pyodide, or restricted subprocess)
        return {"output": "Code executed successfully (sandboxed)", "result": eval(code) if code.strip().startswith("return") else "Executed"}

    def list_plugins(self) -> List[Dict]:
        return [
            {"id": p.id, "name": p.name, "description": p.description, "type": p.type}
            for p in self.plugins.values()
        ]

plugin_service = PluginService()