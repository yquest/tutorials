package pt.fabm

import org.junit.jupiter.api.Test
import pt.fabm.main.MainClient

class Render {
    @Test
    fun renderMainClient(){
        val buffer = MainClient().render()
        print(buffer)
    }
}